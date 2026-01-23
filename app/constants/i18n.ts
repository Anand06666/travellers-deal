import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const LANGUAGE_KEY = 'user-language';

const resources = {
    en: {
        translation: {
            "profile": "Profile",
            "settings": "Settings",
            "support": "Support",
            "feedback": "Feedback",
            "legal": "Legal",
            "language": "Language",
            "language_name": "English",
            "currency": "Currency",
            "appearance": "Appearance",
            "notifications": "Notifications",
            "your_promos": "Your promos",
            "logout": "Log out",
            "version": "Version",
            "select_language": "Select Language",
            "cancel": "Cancel",
            "select_appearance": "Select Appearance",
            "light": "Light Mode",
            "dark": "Dark Mode",
            "system_default": "System Default"
        }
    },
    hi: {
        translation: {
            "profile": "प्रोफ़ाइल",
            "settings": "सेटिंग्स",
            "support": "सहायता",
            "feedback": "प्रतिक्रिया",
            "legal": "कानूनी",
            "language": "भाषा",
            "language_name": "हिंदी",
            "currency": "मुद्रा",
            "appearance": "दिखावट",
            "notifications": "सूचनाएं",
            "your_promos": "आपके प्रोमो",
            "logout": "लॉग आउट",
            "version": "संस्करण",
            "select_language": "भाषा चुनें",
            "cancel": "रद्द करें",
            "select_appearance": "दिखावट चुनें",
            "light": "लाइट मोड",
            "dark": "डार्क मोड",
            "system_default": "सिस्टम डिफ़ॉल्ट"
        }
    },
    es: {
        translation: {
            "profile": "Perfil",
            "settings": "Ajustes",
            "support": "Soporte",
            "feedback": "Comentarios",
            "legal": "Legal",
            "language": "Idioma",
            "language_name": "Español",
            "currency": "Moneda",
            "appearance": "Apariencia",
            "notifications": "Notificaciones",
            "your_promos": "Tus promos",
            "logout": "Cerrar sesión",
            "version": "Versión",
            "select_language": "Seleccionar idioma",
            "cancel": "Cancelar",
            "select_appearance": "Seleccionar apariencia",
            "light": "Modo claro",
            "dark": "Modo oscuro",
            "system_default": "Predeterminado del sistema"
        }
    }
};

const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (savedLanguage) {
                return callback(savedLanguage);
            }

            const deviceLanguage = Localization.getLocales()[0].languageCode ?? 'en';
            callback(deviceLanguage);
        } catch (error) {
            console.log('Error fetching language', error);
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    }
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        }
    });

export default i18n;
