"use client";
import React, { useEffect, useState, useRef, KeyboardEvent } from "react";
import { io, Socket } from "socket.io-client";
import ProtectedRoute from "@/components/Proteção de Rotas/ProtectedRoute";
import { useTranslation } from "react-i18next";
import i18n from "@/components/Tradutor/i18n";
import { useTheme } from "@/context/ThemeContext";
import { FiSend, FiEdit, FiTrash, FiPlus, FiSearch } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import LottieAnimation from "@/components/Animação/LottieAnimation";
import { csrfFetch } from "@/utils/csrfFetch";
import { getCookie } from "@/utils/cookieUtils";


interface Message {
    sender: "user" | "assistant";
    content: string;
}

interface Conversation {
    _id: string;
    title: string;
    messages: Message[];
    owner: string;
}

interface NewMessagePayload {
    content?: string;
    messages?: Message[];
}


export interface ChatPageComponentProps {
    showConversations: boolean;
    toggleConversationsAction: () => void;
}

export default function ChatPageComponent({
    showConversations,
    toggleConversationsAction,
}: ChatPageComponentProps) {
    const { t } = useTranslation();
    const { darkMode } = useTheme();

    const [model, setModel] = useState("deepseek/deepseek-r1:free");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // Inicializa a conexão do WebSocket
    useEffect(() => {
        socketRef.current = io("https://backchat.jeanhenrique.site", {
            withCredentials: true,
            transports: ["polling"],
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const joinedConversationRef = useRef<string | null>(null);

    useEffect(() => {
        if (currentConversationId && socketRef.current) {
            if (joinedConversationRef.current !== currentConversationId) {
                socketRef.current.emit("joinConversation", currentConversationId);
                joinedConversationRef.current = currentConversationId;
            }
            return () => {
                socketRef.current?.emit("leaveConversation", currentConversationId);
                joinedConversationRef.current = null;
            };
        }
    }, [currentConversationId]);


    // Escuta os eventos de novas mensagens
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on("newMessage", (data: NewMessagePayload) => {
                if (data && data.content) {
                    const newMessage: Message = {
                        sender: "assistant",
                        content: data.content,
                    };
                    setMessages((prev) => [...prev, newMessage]);
                } else if (data && data.messages) {
                    setMessages(data.messages);
                }
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            socketRef.current.on("connect_error", (_err) => {
                // Ignorando erro de conexão
            });

        }
        return () => {
            socketRef.current?.off("newMessage");
            socketRef.current?.off("connect_error");
        };
    }, []);


    // Função para buscar conversas via API
    const fetchConversations = async () => {
        try {
            const storedUser = getCookie("user");
            const userData = storedUser ? JSON.parse(storedUser) : null;
            if (!userData || !userData.email) {
                alert("Usuário não autenticado");
                return;
            }
            const res = await csrfFetch(
                `https://backchat.jeanhenrique.site/api/chat/conversations?email=${userData.email}&limit=1000`
            );
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.conversations) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    useEffect(() => {
        const storedUser = getCookie("user");

        if (!storedUser) {
            const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
            if (userCookie) {
                try {
                    const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
                    const userData = JSON.parse(cookieValue);
                    document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; path=/; secure; samesite=strict;`;
                } catch (err) {
                    console.error("Erro ao ler o cookie do usuário:", err);
                }
            }
        }
    }, []);

    useEffect(() => {
        const storedUser = getCookie("user");

        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            i18n.changeLanguage(parsed.preferredLanguage || "Portuguese");
            fetchConversations();
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const filteredConversations = searchQuery
        ? conversations.filter((conv) =>
            conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.messages.some((msg) =>
                msg.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        : conversations;

    const fetchSearchedConversations = async (query: string) => {
        try {
            const storedUser = getCookie("user");

            const userData = storedUser ? JSON.parse(storedUser) : null;
            if (!userData || !userData.email) {
                alert("Usuário não autenticado");
                return;
            }
            const res = await csrfFetch(
                `https://backchat.jeanhenrique.site/api/chat/search?q=${encodeURIComponent(
                    query
                )}&email=${userData.email}`
            );
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Erro na requisição: ${res.status} - ${text}`);
            }
            const data = await res.json();
            if (data.conversations) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
        }
    };

    const handleNewConversation = async () => {
        if (conversations.length >= 20) {
            alert(t("errorConversationLimit"));
            return;
        }
        const storedUser = getCookie("user");

        const userData = storedUser ? JSON.parse(storedUser) : null;
        if (!userData || !userData.email) {
            alert("Usuário não autenticado");
            return;
        }
        try {
            const res = await csrfFetch("https://backchat.jeanhenrique.site/api/chat/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: t("newConversation"), messages: [], email: userData.email }),
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data: Conversation = await res.json();
            setConversations((prev) => [data, ...prev]);
            setCurrentConversationId(data._id);
            setMessages([]);
            setErrorMessage("");
            toggleConversationsAction();
            // Junta-se à sala da nova conversa
            socketRef.current?.emit("joinConversation", data._id);
        } catch (error) {
            console.error("Error creating conversation:", error);
            alert(t("errorCreatingConversation"));
        }
    };

    const handleSelectConversation = (convId: string) => {
        if (isLoading) {
            alert(t("aiProcessing"));
            return;
        }
        setCurrentConversationId(convId);
        const conv = conversations.find((c) => c._id === convId);
        if (conv) setMessages(conv.messages);
        toggleConversationsAction();
    };

    const updateConversationInBackend = async (conversationId: string, title: string, msgs: Message[]) => {
        try {
            await csrfFetch("https://backchat.jeanhenrique.site/api/chat/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, title, messages: msgs }),
            });
        } catch (error) {
            console.error("Error updating conversation:", error);
        }
    };

    const handleUpdateConversationTitle = async (convId: string) => {
        setConversations((prev) =>
            prev.map((conv) => (conv._id === convId ? { ...conv, title: editingTitle } : conv))
        );
        const currentConv = conversations.find((conv) => conv._id === convId);
        if (currentConv) await updateConversationInBackend(convId, editingTitle, currentConv.messages);
        setEditingConversationId(null);
        setEditingTitle("");
    };

    const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, convId: string) => {
        if (e.key === "Enter") {
            handleUpdateConversationTitle(convId);
        }
    };

    const handleDeleteConversation = async (convId: string) => {
        if (!window.confirm(t("confirmDeleteConversation"))) return;
        try {
            const res = await csrfFetch(`https://backchat.jeanhenrique.site/api/chat/conversations/${convId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setConversations((prev) => prev.filter((conv) => conv._id !== convId));
                if (currentConversationId === convId) {
                    setCurrentConversationId(null);
                    setMessages([]);
                }
            } else {
                alert(t("errorDeletingConversation"));
            }
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMessage: Message = { sender: "user", content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        let convId = currentConversationId;
        if (!convId) {
            const conversationTitle = userMessage.content.substring(0, 50) || t("newConversation");
            try {
                const storedUser = getCookie("user");

                const userData = storedUser ? JSON.parse(storedUser) : null;
                if (!userData || !userData.email) {
                    alert("Usuário não autenticado");
                    return;
                }
                const createRes = await csrfFetch("https://backchat.jeanhenrique.site/api/chat/conversations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: conversationTitle,
                        messages: [{ sender: "user", content: userMessage.content }],
                        email: userData.email
                    }),
                });
                if (!createRes.ok) throw new Error(`HTTP error! status: ${createRes.status}`);
                const createdConv = await createRes.json();
                convId = createdConv._id;
                setCurrentConversationId(convId);
                setConversations((prev) => [createdConv, ...prev]);
                // Junta-se à sala da nova conversa
                socketRef.current?.emit("joinConversation", convId);
            } catch (error) {
                console.error("Error creating conversation:", error);
            }
        } else {
            const existingConv = conversations.find((c) => c._id === convId);
            if (existingConv && (existingConv.messages.length === 0 || existingConv.title === t("newConversation"))) {
                const conversationTitle = userMessage.content.substring(0, 15) || t("newConversation");
                existingConv.title = conversationTitle;
                existingConv.messages = updatedMessages;
                try {
                    await updateConversationInBackend(convId, conversationTitle, updatedMessages);
                } catch (error) {
                    console.error("Error renaming conversation:", error);
                }
                setConversations((prev) =>
                    prev.map((conv) =>
                        conv._id === convId ? { ...conv, title: conversationTitle, messages: updatedMessages } : conv
                    )
                );
            }
        }

        // Emite a nova mensagem via WebSocket para os demais clientes conectados na conversa
        if (socketRef.current && convId) {
            socketRef.current.emit("sendMessage", { conversationId: convId, message: userMessage });
        }

        setIsLoading(true);
        try {
            const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK;
            if (!apiKey) {
                throw new Error("A chave da API não foi encontrada. Verifique seu arquivo .env.");
            }
            const errorResponse = t("Api Falhou. Digite novamente a pergunta") || "API failed, please try again";
            let assistantContent = "";
            let attempts = 0;
            while (attempts < 5) {
                attempts++;
                const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model,
                        messages: updatedMessages.map((m) => ({ role: m.sender, content: m.content })),
                        top_p: 1,
                        temperature: 0.9,
                        repetition_penalty: 1,
                    }),
                });
                const data = await apiResponse.json();
                assistantContent =
                    data.choices && data.choices[0]?.message?.content?.trim()
                        ? data.choices[0].message.content.trim()
                        : errorResponse;
                if (assistantContent !== errorResponse) break;
            }
            if (assistantContent === errorResponse) {
                throw new Error(errorResponse);
            }
            const assistantMessage: Message = { sender: "assistant", content: assistantContent };
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            if (convId) {
                await csrfFetch("https://backchat.jeanhenrique.site/api/chat/conversations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ conversationId: convId, messages: finalMessages }),
                });
                setConversations((prev) =>
                    prev.map((conv) => (conv._id === convId ? { ...conv, messages: finalMessages } : conv))
                );
                // Emite a resposta do assistente via WebSocket
                socketRef.current?.emit("sendMessage", { conversationId: convId, message: assistantMessage });
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setErrorMessage(t("Api Falhou. Digite novamente a pergunta") || "API failed, please try again");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className={`flex ${darkMode ? "bg-[#0d0d0d]" : "bg-gray-50"} overflow-hidden`}>
                <aside
                    className={`flex-shrink-0 fixed md:static inset-y-0 left-0 z-60 w-3/4 max-w-xs ${darkMode ? "bg-[#0d0d0d]" : "bg-white"
                        } p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${showConversations ? "translate-x-0" : "-translate-x-full"
                        } md:w-1/4 md:translate-x-0 mt-16 md:mt-0`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => setSearchActive(true)} title={t("searchConversations")} className="p-1">
                            <FiSearch size={20} className="text-gray-500" />
                        </button>
                        <h2 className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                            {t("conversations")}
                        </h2>
                        <button
                            onClick={() => {
                                if (conversations.length >= 20) {
                                    alert(t("errorConversationLimitDetail"));
                                } else {
                                    handleNewConversation();
                                }
                            }}
                            title={conversations.length >= 20 ? t("limitReached") : t("createNewConversation")}
                            className={`p-1 transition-opacity duration-200 ${conversations.length >= 20 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                }`}
                            disabled={conversations.length >= 20}
                        >
                            <FiPlus size={20} className="text-green-500" />
                        </button>
                    </div>
                    {searchActive && (
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    fetchSearchedConversations(searchQuery);
                                }
                            }}
                            placeholder={t("searchPlaceholder")}
                            className={`w-full p-2 mb-4 rounded border focus:outline-none ${darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-gray-100 text-gray-800 border-gray-300"}`}
                        />
                    )}

                    <div className="space-y-1.5 mb-5 max-h-[70vh] overflow-y-auto">
                        {filteredConversations.map((conv) => (
                            <div
                                key={`conv-${conv._id}`}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer ${conv._id === currentConversationId
                                    ? "bg-blue-600 text-white hover:bg-blue-500"
                                    : darkMode
                                        ? "bg-gray-900 text-gray-100 hover:bg-gray-800"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                                onClick={() => handleSelectConversation(conv._id)}
                            >
                                <div className="flex-grow">
                                    {editingConversationId === conv._id ? (
                                        <input
                                            type="text"
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            onKeyDown={(e) => handleEditKeyDown(e, conv._id)}
                                            onBlur={() => handleUpdateConversationTitle(conv._id)}
                                            className="w-full p-1 rounded bg-transparent border border-dashed"
                                            autoFocus
                                        />
                                    ) : (
                                        <span>{conv.title}</span>
                                    )}
                                </div>
                                <div className="flex space-x-2 ml-2">
                                    <FiEdit
                                        size={16}
                                        className="cursor-pointer hover:text-blue-400"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingConversationId(conv._id);
                                            setEditingTitle(conv.title);
                                        }}
                                    />
                                    <FiTrash
                                        size={16}
                                        className="cursor-pointer hover:text-red-400"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteConversation(conv._id);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                <section className="flex flex-col w-full h-full md:ml-0 md:static max-h-[83vh]">
                    <div className="p-4">
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className={`p-2 rounded-md border text-sm ${darkMode ? "border-gray-700 bg-gray-700 text-gray-100" : "border-gray-300 bg-gray-100 text-gray-900"
                                }`}
                        >
                            <option value="deepseek/deepseek-r1:free">DeepSeek Chat</option>
                        </select>
                    </div>
                    <div
                        className={`flex-grow overflow-y-auto border rounded-md p-2 mx-4 h-[70vh] ${darkMode ? "bg-[#0d0d0d] text-gray-100 border-gray-700" : "bg-gray-50 text-gray-800 border-gray-300"
                            }`}
                        role="log"
                        aria-live="polite"
                    >
                        {messages.length === 0 ? (
                            <div className="mb-3 w-full">
                                <p className="text-sm">{t("suggestions")}</p>
                                <div className="w-full flex flex-wrap gap-2 mt-2">
                                    <button
                                        className="cursor-pointer transition-colors duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
                                        onClick={() => setInput(t("prompt1"))}
                                    >
                                        {t("prompt1")}
                                    </button>
                                    <button
                                        className="cursor-pointer transition-colors duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
                                        onClick={() => setInput(t("prompt2"))}
                                    >
                                        {t("prompt2")}
                                    </button>
                                    <button
                                        className="cursor-pointer transition-colors duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
                                        onClick={() => setInput(t("prompt3"))}
                                    >
                                        {t("prompt3")}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={`message-${index}`} className={`mb-3 flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg shadow-md text-sm ${msg.sender === "user"
                                            ? darkMode
                                                ? "bg-blue-600 text-white"
                                                : "bg-blue-100 text-blue-900"
                                            : darkMode
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-200 text-gray-900"
                                            }`}
                                    >
                                        <ReactMarkdown className="whitespace-pre-line">{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-center mt-2">
                                <div className="flex items-center space-x-2 animate-pulse">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                    <span>{t("aiThinking")}</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className="m-4 flex" aria-label="Message Form">
                        <textarea
                            maxLength={20000}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className={`flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none text-sm ${darkMode ? "border-gray-700 bg-[#0d0d0d] text-white" : "border-gray-300 bg-white text-gray-900"
                                }`}
                            placeholder={t("placeholderInput")}
                            rows={2}
                            aria-label="Type your message"
                        />
                        <button
                            type="submit"
                            className="ml-2 p-2 bg-green-600 hover:bg-green-500 rounded text-white transition-colors"
                            title={t("send")}
                            aria-label="Send message"
                        >
                            <FiSend size={20} />
                        </button>
                    </form>
                    {errorMessage && (
                        <div className="mx-4 mb-4 p-2 bg-red-100 text-red-600 rounded-md text-sm" role="alert">
                            {errorMessage}
                        </div>
                    )}
                </section>
            </div>
            {isLoading && (
                <div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-30"
                    onClick={(e) => e.stopPropagation()}
                >
                    <LottieAnimation />
                </div>
            )}
        </ProtectedRoute>
    );
}
