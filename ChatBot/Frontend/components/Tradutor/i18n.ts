import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    English: {
        translation: {
            newConversation: "New Conversation",
            suggestions: "Prompt Suggestions:",
            prompt1: "Hello, how are you?",
            prompt2: "Tell me a joke",
            prompt3: "What's the weather forecast?",
            aiThinking: "AI is thinking...",
            conversations: "Conversations",
            placeholderInput: "Type your message...",
            send: "Send",
            userGreeting: "Hello, {{name}}",
            editProfile: "Edit Profile",
            logout: "Logout",
            darkMode: "Dark Mode",
            lightMode: "Light Mode",
            language: "Language",
            login: "Login",
            register: "Register",
            email: "Email",
            password: "Password",
            newPassword: "New Password",
            confirmPassword: "Confirm Password",
            updateProfile: "Update Profile",
            deleteAccount: "Delete Account",
            profileUpdated: "Profile updated!",
            profileUpdateError: "Error updating profile.",
            accountDeleted: "Account deleted.",
            accountDeleteError: "Error deleting account.",
            registration: "Registration",
            // These keys are used as link texts
            loginPrompt: "Don't have an account? <a href='/register' class='text-blue-500'>register</a>",
            registerPrompt: "Already have an account? <a href='/login' class='text-blue-500'>login</a>",
            changeLanguage: "Change Language",
            help: "Need help? Click here",
            errorConversationLimit: "Conversation limit reached.",
            errorCreatingConversation: "Error creating conversation.",
            searchConversations: "Search conversations",
            searchPlaceholder: "Search conversations...",
            aiProcessing: "AI is processing...",
            confirmDeleteConversation: "Are you sure you want to delete this conversation?",
            confirmDeleteAccount: "Are you sure you want to delete your account?",
            passwordMismatch: "Passwords do not match.",
            passwordWeak: "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.",
            // Rules / Instructions:
            ruleAccountExpires: "Your account will be automatically deleted after 7 days.",
            ruleTwoRegistrationsPerIP: "Only two accounts per IP per week are allowed.",
            ruleOneAccountPerEmail: "Only one account per email is allowed.",
            ruleConversationLimits: "Each account can have at most 20 conversations and each conversation up to 20,000 characters.",
            // Additional keys for modals:
            registrationForm: "Registration Form",
            selectLanguage: "Select Language",
            rulesTitle: "Rules & Instructions",
            // Change Password Modal keys:
            changePassword: "Change Password",
            passwordChangeInstruction: "Enter your current password, new password, and confirm the new password to change your password.",
            updatePassword: "Update Password",
            passwordChangedSuccessfully: "Password changed successfully!",
            currentPassword: "Current Password",
            name: "Name"
        }
    },
    Portuguese: {
        translation: {
            newConversation: "Nova Conversa",
            suggestions: "Sugestões de prompt:",
            prompt1: "Olá, tudo bem?",
            prompt2: "Conte uma piada",
            prompt3: "Qual é a previsão do tempo?",
            aiThinking: "IA pensando...",
            conversations: "Conversas",
            placeholderInput: "Digite sua mensagem...",
            send: "Enviar",
            userGreeting: "Olá, {{name}}",
            editProfile: "Editar Perfil",
            logout: "Sair",
            darkMode: "Modo Escuro",
            lightMode: "Modo Claro",
            language: "Idioma",
            login: "Login",
            register: "Cadastro",
            email: "E-mail",
            password: "Senha",
            newPassword: "nova senha", // em lowercase
            confirmPassword: "Confirmar Senha",
            updateProfile: "Atualizar Perfil",
            deleteAccount: "Excluir Conta",
            profileUpdated: "Perfil atualizado!",
            profileUpdateError: "Erro ao atualizar perfil.",
            accountDeleted: "Conta excluída.",
            accountDeleteError: "Erro ao excluir conta.",
            registration: "Cadastro",
            // Links para navegação:
            loginPrompt: "Não tem conta? <a href='/register' class='text-blue-500'>cadastre-se</a>",
            registerPrompt: "Já possui conta? <a href='/login' class='text-blue-500'>faça login</a>",
            changeLanguage: "Alterar Idioma",
            help: "Precisa de ajuda? Clique aqui",
            errorConversationLimit: "Limite de 20 conversas atingido.",
            errorCreatingConversation: "Erro ao criar nova conversa.",
            searchConversations: "Buscar conversas",
            searchPlaceholder: "Buscar conversas...",
            aiProcessing: "IA está gerando a resposta...",
            confirmDeleteConversation: "Tem certeza que deseja excluir esta conversa?",
            confirmDeleteAccount: "Tem certeza que deseja excluir sua conta?",
            passwordMismatch: "As senhas não conferem.",
            passwordWeak: "A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, dígito e símbolo.",
            // Rules / Instructions:
            ruleAccountExpires: "Sua conta será automaticamente excluída após 7 dias.",
            ruleTwoRegistrationsPerIP: "Apenas duas contas por IP por semana são permitidas.",
            ruleOneAccountPerEmail: "Apenas uma conta por e-mail é permitida.",
            ruleConversationLimits: "Cada conta pode ter no máximo 20 conversas e cada conversa, no máximo, 20.000 caracteres.",
            // Additional keys for modals:
            registrationForm: "Formulário de Cadastro",
            selectLanguage: "Selecione o Idioma",
            rulesTitle: "Regras e Instruções",
            // Change Password Modal keys:
            changePassword: "Alterar Senha",
            passwordChangeInstruction: "Digite sua senha atual, a nova senha e confirme a nova senha para alterar sua senha.",
            updatePassword: "Atualizar Senha",
            passwordChangedSuccessfully: "Senha alterada com sucesso!",
            currentPassword: "Senha Atual",
            name: "Nome"
        }
    },
    Spanish: {
        translation: {
            newConversation: "Nueva Conversación",
            suggestions: "Sugerencias de prompt:",
            prompt1: "Hola, ¿cómo estás?",
            prompt2: "Cuéntame un chiste",
            prompt3: "¿Cuál es el pronóstico del tiempo?",
            aiThinking: "La IA está pensando...",
            conversations: "Conversaciones",
            placeholderInput: "Escribe tu mensaje...",
            send: "Enviar",
            userGreeting: "Hola, {{name}}",
            editProfile: "Editar Perfil",
            logout: "Salir",
            darkMode: "Modo Oscuro",
            lightMode: "Modo Claro",
            language: "Idioma",
            login: "Iniciar Sesión",
            register: "Registro",
            email: "Correo Electrónico",
            password: "Contraseña",
            newPassword: "nueva contraseña",
            confirmPassword: "Confirmar Contraseña",
            updateProfile: "Actualizar Perfil",
            deleteAccount: "Eliminar Cuenta",
            profileUpdated: "¡Perfil actualizado!",
            profileUpdateError: "Error al actualizar el perfil.",
            accountDeleted: "Cuenta eliminada.",
            accountDeleteError: "Error al eliminar la cuenta.",
            registration: "Registro",
            loginPrompt: "¿No tienes cuenta? <a href='/register' class='text-blue-500'>regístrate</a>",
            registerPrompt: "¿Ya tienes cuenta? <a href='/login' class='text-blue-500'>inicia sesión</a>",
            changeLanguage: "Cambiar Idioma",
            help: "¿Necesitas ayuda? Haz clic aquí",
            errorConversationLimit: "Se alcanzó el límite de 20 conversaciones.",
            errorCreatingConversation: "Error al crear la conversación.",
            searchConversations: "Buscar conversaciones",
            searchPlaceholder: "Buscar conversaciones...",
            aiProcessing: "La IA está procesando...",
            confirmDeleteConversation: "¿Estás seguro de que deseas eliminar esta conversación?",
            confirmDeleteAccount: "¿Estás seguro de que deseas eliminar tu cuenta?",
            passwordMismatch: "Las contraseñas no coinciden.",
            passwordWeak: "La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas, dígitos y un carácter especial.",
            // Rules / Instructions:
            ruleAccountExpires: "Tu cuenta se eliminará automáticamente después de 7 días.",
            ruleTwoRegistrationsPerIP: "Solo se permiten dos cuentas por IP por semana.",
            ruleOneAccountPerEmail: "Solo se permite una cuenta por correo electrónico.",
            ruleConversationLimits: "Cada cuenta puede tener un máximo de 20 conversaciones y cada conversación hasta 20,000 caracteres.",
            // Additional keys for modals:
            registrationForm: "Formulario de Registro",
            selectLanguage: "Selecciona el Idioma",
            rulesTitle: "Reglas e Instrucciones",
            // Change Password Modal keys:
            changePassword: "Cambiar Contraseña",
            passwordChangeInstruction: "Introduce tu contraseña actual, la nueva contraseña y confírmala para cambiar tu contraseña.",
            updatePassword: "Actualizar Contraseña",
            passwordChangedSuccessfully: "¡Contraseña actualizada con éxito!",
            currentPassword: "Contraseña Actual",
            name: "Nombre"
        }
    },
    French: {
        translation: {
            newConversation: "Nouvelle Conversation",
            suggestions: "Suggestions de prompt :",
            prompt1: "Bonjour, comment ça va ?",
            prompt2: "Raconte-moi une blague",
            prompt3: "Quelle est la météo ?",
            aiThinking: "L'IA réfléchit...",
            conversations: "Conversations",
            placeholderInput: "Tapez votre message...",
            send: "Envoyer",
            userGreeting: "Bonjour, {{name}}",
            editProfile: "Modifier le Profil",
            logout: "Déconnexion",
            darkMode: "Mode Sombre",
            lightMode: "Mode Clair",
            language: "Langue",
            login: "Connexion",
            register: "Inscription",
            email: "E-mail",
            password: "Mot de passe",
            newPassword: "nouveau mot de passe",
            confirmPassword: "Confirmer le mot de passe",
            updateProfile: "Mettre à jour le Profil",
            deleteAccount: "Supprimer le Compte",
            profileUpdated: "Profil mis à jour !",
            profileUpdateError: "Erreur lors de la mise à jour du profil.",
            accountDeleted: "Compte supprimé.",
            accountDeleteError: "Erreur lors de la suppression du compte.",
            registration: "Inscription",
            loginPrompt: "Pas de compte ? <a href='/register' class='text-blue-500'>inscrivez-vous</a>",
            registerPrompt: "Vous avez déjà un compte ? <a href='/login' class='text-blue-500'>connectez-vous</a>",
            changeLanguage: "Changer de Langue",
            help: "Besoin d'aide ? Cliquez ici",
            errorConversationLimit: "Limite de 20 conversations atteinte.",
            errorCreatingConversation: "Erreur lors de la création de la conversation.",
            searchConversations: "Rechercher des conversations",
            searchPlaceholder: "Rechercher des conversations...",
            aiProcessing: "L'IA est en cours de traitement...",
            confirmDeleteConversation: "Êtes-vous sûr de vouloir supprimer cette conversation ?",
            confirmDeleteAccount: "Êtes-vous sûr de vouloir supprimer votre compte ?",
            passwordMismatch: "Les mots de passe ne correspondent pas.",
            passwordWeak: "Le mot de passe doit comporter au moins 8 caractères et inclure des majuscules, minuscules, chiffres et caractères spéciaux.",
            // Rules / Instructions:
            ruleAccountExpires: "Votre compte sera automatiquement supprimé après 7 jours.",
            ruleTwoRegistrationsPerIP: "Seules deux inscriptions par IP par semaine sont autorisées.",
            ruleOneAccountPerEmail: "Une seule inscription par e-mail est autorisée.",
            ruleConversationLimits: "Chaque compte ne peut avoir que 20 conversations et chaque conversation est limitée à 20 000 caractères.",
            // Additional keys for modals:
            registrationForm: "Formulaire d'Inscription",
            selectLanguage: "Sélectionnez la Langue",
            rulesTitle: "Règles et Instructions"
        }
    },
    Arabic: {
        translation: {
            newConversation: "محادثة جديدة",
            suggestions: "اقتراحات:",
            prompt1: "مرحباً، كيف حالك؟",
            prompt2: "أخبرني بنكتة",
            prompt3: "ما توقعات الطقس؟",
            aiThinking: "الذكاء الاصطناعي يفكر...",
            conversations: "المحادثات",
            placeholderInput: "اكتب رسالتك...",
            send: "إرسال",
            userGreeting: "مرحباً، {{name}}",
            editProfile: "تحرير الملف الشخصي",
            logout: "تسجيل الخروج",
            darkMode: "الوضع الداكن",
            lightMode: "الوضع الفاتح",
            language: "اللغة",
            login: "تسجيل الدخول",
            register: "تسجيل",
            email: "البريد الإلكتروني",
            password: "كلمة المرور",
            newPassword: "كلمة مرور جديدة",
            confirmPassword: "تأكيد كلمة المرور",
            updateProfile: "تحديث الملف الشخصي",
            deleteAccount: "حذف الحساب",
            profileUpdated: "تم تحديث الملف الشخصي!",
            profileUpdateError: "حدث خطأ أثناء تحديث الملف الشخصي.",
            accountDeleted: "تم حذف الحساب.",
            accountDeleteError: "حدث خطأ أثناء حذف الحساب.",
            registration: "التسجيل",
            loginPrompt: "ليس لديك حساب؟ <a href='/register' class='text-blue-500'>سجّل الآن</a>",
            registerPrompt: "هل لديك حساب؟ <a href='/login' class='text-blue-500'>سجّل الدخول</a>",
            changeLanguage: "تغيير اللغة",
            help: "بحاجة إلى مساعدة؟ انقر هنا",
            errorConversationLimit: "لقد وصلت إلى الحد الأقصى من 20 محادثة.",
            errorCreatingConversation: "حدث خطأ أثناء إنشاء المحادثة.",
            searchConversations: "البحث في المحادثات",
            searchPlaceholder: "البحث في المحادثات...",
            aiProcessing: "الذكاء الاصطناعي يعمل...",
            confirmDeleteConversation: "هل أنت متأكد من حذف هذه المحادثة؟",
            confirmDeleteAccount: "هل أنت متأكد من حذف حسابك؟",
            passwordMismatch: "كلمتا المرور غير متطابقتين.",
            passwordWeak: "يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على حرف كبير، حرف صغير، رقم ورمز.",
            // Rules / Instructions:
            ruleAccountExpires: "سيتم حذف حسابك تلقائيًا بعد 7 أيام.",
            ruleTwoRegistrationsPerIP: "يسمح بحسابين فقط لكل IP في الأسبوع.",
            ruleOneAccountPerEmail: "يسمح بحساب واحد فقط لكل بريد إلكتروني.",
            ruleConversationLimits: "كل حساب يمكن أن يحتوي على 20 محادثة كحد أقصى، وكل محادثة بحد أقصى 20,000 حرف.",
            // Additional keys for modals:
            registrationForm: "نموذج التسجيل",
            selectLanguage: "اختر اللغة",
            rulesTitle: "القواعد والتعليمات"
        }
    },
    Chinese: {
        translation: {
            newConversation: "新对话",
            suggestions: "提示建议：",
            prompt1: "你好，你怎么样？",
            prompt2: "讲个笑话",
            prompt3: "今天天气如何？",
            aiThinking: "AI 正在思考...",
            conversations: "对话",
            placeholderInput: "输入你的消息...",
            send: "发送",
            userGreeting: "你好，{{name}}",
            editProfile: "编辑个人资料",
            logout: "退出",
            darkMode: "深色模式",
            lightMode: "浅色模式",
            language: "语言",
            login: "登录",
            register: "注册",
            email: "电子邮件",
            password: "密码",
            newPassword: "新密码",
            confirmPassword: "确认密码",
            updateProfile: "更新资料",
            deleteAccount: "删除账户",
            profileUpdated: "资料更新成功！",
            profileUpdateError: "更新资料时出错。",
            accountDeleted: "账户已删除。",
            accountDeleteError: "删除账户时出错。",
            registration: "注册",
            loginPrompt: "没有账户？<a href='/register' class='text-blue-500'>注册</a>",
            registerPrompt: "已有账户？<a href='/login' class='text-blue-500'>登录</a>",
            changeLanguage: "更改语言",
            help: "需要帮助？点击这里",
            errorConversationLimit: "已达到20个对话的上限。",
            errorCreatingConversation: "创建对话时出错。",
            searchConversations: "搜索对话",
            searchPlaceholder: "搜索对话...",
            aiProcessing: "AI 正在处理...",
            confirmDeleteConversation: "确定要删除此对话吗？",
            confirmDeleteAccount: "确定要删除您的账户吗？",
            passwordMismatch: "两次输入的密码不匹配。",
            passwordWeak: "密码至少需要8个字符，并且包含大写字母、小写字母、数字和特殊字符。",
            // Rules / Instructions:
            ruleAccountExpires: "您的账户将在7天后自动删除。",
            ruleTwoRegistrationsPerIP: "每个IP每周最多允许两个账户。",
            ruleOneAccountPerEmail: "每个电子邮件地址只能注册一个账户。",
            ruleConversationLimits: "每个账户最多可以拥有20个对话，每个对话最多20000个字符。",
            // Additional keys for modals:
            registrationForm: "注册表单",
            selectLanguage: "选择语言",
            rulesTitle: "规则与说明"
        }
    }
};

export const languageNames: string[] = [
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

i18n.use(initReactI18next).init({
    resources,
    lng: "Portuguese",
    fallbackLng: "Portuguese",
    interpolation: { escapeValue: false }
});

export default i18n;
