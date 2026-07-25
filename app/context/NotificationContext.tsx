'use client';

import { useContext, useState, createContext, Dispatch, SetStateAction } from "react";
export type NotificationType = 'success' | 'error' | 'info';

// The type of the Notification controller
interface NotificationContextType {
    content: string | null;
    isOpen: boolean;
    type?: NotificationType;
}

// The type to be passed in the notification (in value)
interface NotificationProviderValueType {
    notification: NotificationContextType;
    setNotification: Dispatch<SetStateAction<NotificationContextType>>;
    showNotification: (content: string, type?: NotificationType) => void;
}

// Create the context
const NotificationContext = createContext<NotificationProviderValueType | undefined>(undefined);

// Create the provider and pass the controller to every child in provider
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    // Notification controller
    const [notification, setNotification] = useState<NotificationContextType>({ content: null, isOpen: false, type: 'info' });

    const showNotification = (content: string, type: NotificationType = 'info') => {
        if (typeof window !== 'undefined') {
            const notificationSound = new Audio('/sound/notification.wav');
            notificationSound.volume = 0.3;
            notificationSound.play().catch(() => {
                // Ignore autoplay restrictions if user hasn't interacted
            });
        }
        setNotification({ content, isOpen: true, type });
        setTimeout(() => {
            setNotification({ content: null, isOpen: false, type: 'info' });
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ notification, setNotification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
// Custom hook to get the challenge controller from the context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("Must be wrapped within the provider");
    }
    return context;
}