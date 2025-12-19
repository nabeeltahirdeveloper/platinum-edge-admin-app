import axiosInstance from './axiosConfig';

export default {
    getNotifications(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'getNotifications',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    markNotificationRead(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'markNotificationRead',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    markAllNotificationsRead(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'markAllNotificationsRead',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    deleteNotification(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'deleteNotification',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    }
};
