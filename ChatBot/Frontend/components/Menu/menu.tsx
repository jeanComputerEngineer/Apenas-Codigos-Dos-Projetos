"use client";
import React, { useState, useEffect } from "react";
import {
    FiUser,
    FiGlobe,
    FiSun,
    FiMoon,
    FiLogOut,
    FiEdit,
    FiMenu,
    FiX,
    FiKey
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import i18n, { languageNames } from "@/components/Tradutor/i18n";
import Select, { StylesConfig } from "react-select";
import { csrfFetch } from "@/utils/csrfFetch";
import ChangePasswordModal from "../AlterarSenha/ChangePasswordModal";
import { getCookie } from "@/utils/cookieUtils";


export interface TopMenuProps {
    toggleConversationsAction: () => void;
}

export default function TopMenu({ toggleConversationsAction }: TopMenuProps) {
    const router = useRouter();
    const { darkMode, toggleDarkMode } = useTheme();
    const { t } = useTranslation();

    // Note: agora incluí `isGitHub` no tipo
    const [user, setUser] = useState<{
        name: string;
        email: string;
        preferredLanguage: string;
        isGitHub?: boolean;
    } | null>(null);

    const [selectedLang, setSelectedLang] = useState("English");
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            const storedUser = getCookie("user");

            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                setSelectedLang(parsed.preferredLanguage || "English");
                setProfileName(parsed.name);
            }
        }
    }, [user]);



    // 2) Lidar com mudança de idioma
    const handleLanguageChange = async (option: { value: string; label: string } | null) => {
        if (option) {
            setSelectedLang(option.value);
            i18n.changeLanguage(option.value);
            if (user && user.name !== profileName) {
                try {
                    const res = await csrfFetch("https://backchat.jeanhenrique.site/api/auth/account", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: user.email, name: profileName })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; secure; samesite=strict;`;
                        setUser(data.user);
                    }
                } catch (err) {
                    console.error("Error updating language:", err);
                }
            }
        }
    };

    // 3) Botão de editar perfil
    const handleEditProfile = () => setProfileModalOpen(true);

    // 4) Botão de logout
    const handleLogout = () => {
        setSettingsOpen(false);
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
    };

    // 5) Atualizar perfil
    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || user.name === profileName) {
            setProfileModalOpen(false);
            return;
        }
        try {
            const res = await csrfFetch("https://backchat.jeanhenrique.site/api/auth/account", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, name: profileName })
            });
            if (res.ok) {
                const data = await res.json();
                // Atualiza o cookie "user"
                document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; secure; samesite=strict;`;
                setUser(data.user);
                alert(t("profileUpdated"));
                setProfileModalOpen(false);
            } else {
                alert(t("profileUpdateError"));
            }
        } catch (err) {
            console.error("Profile update error:", err);
            alert(t("profileUpdateError"));
        }
    };

    // 6) Botão de abrir modal de trocar senha
    const handleOpenPasswordModal = () => setPasswordModalOpen(true);

    // 7) Botão de deletar conta
    const handleProfileDelete = async () => {
        if (confirm(t("confirmDeleteAccount"))) {
            try {
                const res = await csrfFetch(`https://backchat.jeanhenrique.site/api/auth/account?email=${user?.email}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    // Remove o cookie definindo uma data de expiração no passado
                    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    router.push("/register");
                } else {
                    alert(t("accountDeleteError"));
                }
            } catch {
                alert(t("accountDeleteError"));
            }
        }
    };

    // 8) Opções de idioma
    const options = languageNames
        .filter((lang) => {
            const allowed = [
                "English",
                "Portuguese",
                "Spanish",
                "French",
                "Arabic",
                "Chinese",
                "Russian",
                "Hindi",
                "Bengali",
                "Indonesian"
            ];
            return allowed.includes(lang);
        })
        .map((lang) => ({ value: lang, label: lang }));

    // 9) Estilos do react-select
    const selectStyles: StylesConfig<{ value: string; label: string }, false> = {
        control: (provided) => ({
            ...provided,
            backgroundColor: darkMode ? "#2d3748" : "transparent",
            border: "none",
            boxShadow: "none"
        }),
        singleValue: (provided) => ({
            ...provided,
            color: darkMode ? "#f7fafc" : "#2d3748"
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: darkMode ? "#2d3748" : "#fff"
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? darkMode
                    ? "#4a5568"
                    : "#e2e8f0"
                : darkMode
                    ? "#2d3748"
                    : "#fff",
            color: darkMode ? "#f7fafc" : "#2d3748",
            cursor: "pointer"
        })
    };

    return (
        <>
            <header className={`sticky top-0 z-50 w-full shadow ${darkMode ? "bg-black" : "bg-gray-100"}`}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Botão de abrir/fechar lista de conversas (mobile) */}
                    <button
                        className="md:hidden p-2 rounded focus:outline-none hover:opacity-80"
                        onClick={toggleConversationsAction}
                        title={t("conversations")}
                    >
                        <FiMenu className={darkMode ? "text-gray-100" : "text-gray-800"} size={24} />
                    </button>

                    <h1 className={`text-xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                        ChatBot
                    </h1>

                    <div className="flex items-center">
                        {/* Área do menu (desktop) */}
                        <div className="hidden md:flex items-center space-x-4">

                            {/* Exibe nome do usuário (para todos, GitHub ou não) */}
                            {user && (
                                <div className="flex items-center space-x-2" title="Usuário logado">
                                    <FiUser className={darkMode ? "text-gray-100" : "text-gray-800"} size={20} />
                                    <span className={`text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                                        {user.name}
                                    </span>
                                </div>
                            )}

                            {/* Se NÃO for GitHub, mostra botão de editar perfil */}
                            {user && !user.isGitHub && (
                                <button
                                    onClick={handleEditProfile}
                                    className="p-2 rounded focus:outline-none hover:opacity-80"
                                    title={t("editProfile")}
                                >
                                    <FiEdit size={20} className="text-blue-500 hover:text-blue-400" />
                                </button>
                            )}

                            {/* Se for GitHub, não mostra nada de edição */}

                            {/* Seletor de idioma */}
                            <div className="flex items-center space-x-1">
                                <FiGlobe
                                    className={darkMode ? "text-gray-100" : "text-gray-800"}
                                    size={20}
                                    title={t("language")}
                                />
                                <div className="w-40 cursor-pointer">
                                    <Select
                                        options={options}
                                        value={options.find((o) => o.value === selectedLang)}
                                        onChange={handleLanguageChange}
                                        instanceId="language-select"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder={t("changeLanguage")}
                                        isSearchable
                                        styles={selectStyles}
                                    />
                                </div>
                            </div>

                            {/* Botão de tema */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded focus:outline-none hover:opacity-80"
                                title={darkMode ? t("lightMode") : t("darkMode")}
                            >
                                {darkMode ? (
                                    <FiSun size={20} className="text-white hover:text-gray-200" />
                                ) : (
                                    <FiMoon size={20} className="text-black hover:text-gray-700" />
                                )}
                            </button>

                            {/* Botão de logout */}
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded focus:outline-none hover:opacity-80"
                                title={t("logout")}
                            >
                                <FiLogOut size={20} className="text-red-500 hover:text-red-400" />
                            </button>
                        </div>

                        {/* Botão para abrir configurações (mobile) */}
                        <div className="md:hidden">
                            <button
                                className="p-2 rounded focus:outline-none hover:opacity-80"
                                onClick={() => setSettingsOpen(true)}
                                title={t("settings")}
                            >
                                <FiEdit className={darkMode ? "text-gray-100" : "text-gray-800"} size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal de editar perfil */}
            {profileModalOpen && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 max-w-md">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setProfileModalOpen(false)}
                                className="text-red-500 focus:outline-none hover:opacity-80"
                                title={t("close")}
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleProfileUpdate} className="mt-4">
                            <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                {t("editProfile")}
                            </h1>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("name")}
                            </label>
                            <input
                                type="text"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="w-full p-2 mb-3 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {t("updateProfile")}
                            </button>
                        </form>
                        <div className="mt-4">
                            <button
                                onClick={handleOpenPasswordModal}
                                className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                <FiKey className="inline mr-2" /> {t("changePassword")}
                            </button>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleProfileDelete}
                                className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                {t("deleteAccount")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de trocar senha */}
            {passwordModalOpen && <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />}

            {/* Modal de configurações (mobile) */}
            {settingsOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 max-w-md">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setSettingsOpen(false)}
                                className="text-red-500 focus:outline-none hover:opacity-80"
                                title={t("close")}
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {/* Botão de editar perfil (mobile) */}
                            {!user?.isGitHub && (
                                <button
                                    onClick={handleEditProfile}
                                    className="flex flex-col items-center justify-center p-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
                                    title={t("editProfile")}
                                >
                                    <FiEdit size={20} />
                                    <span className="text-xs mt-1">{t("editProfile")}</span>
                                </button>
                            )}
                            {/* Botão de tema */}
                            <button
                                onClick={toggleDarkMode}
                                className="flex flex-col items-center justify-center p-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
                                title={darkMode ? t("lightMode") : t("darkMode")}
                            >
                                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                                <span className="text-xs mt-1">{darkMode ? t("lightMode") : t("darkMode")}</span>
                            </button>

                            {/* Seletor de idioma (mobile) */}
                            <div
                                className="flex flex-col items-center justify-center p-2 bg-green-600 rounded text-white"
                                title={t("language")}
                            >
                                <FiGlobe size={20} />
                                <div className="w-28 mt-1">
                                    <Select
                                        options={options}
                                        value={options.find((o) => o.value === selectedLang)}
                                        onChange={handleLanguageChange}
                                        instanceId="language-select"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder={t("changeLanguage")}
                                        isSearchable
                                        styles={selectStyles}
                                    />
                                </div>
                            </div>

                            {/* Logout (mobile) */}
                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center justify-center p-2 bg-black hover:bg-gray-700 rounded text-white"
                                title={t("logout")}
                            >
                                <FiLogOut size={20} />
                                <span className="text-xs mt-1">{t("logout")}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
