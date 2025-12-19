import axiosInstance from './axiosConfig';

export default {
    checkAdminAccess(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'checkAdminAccess',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    login(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'login',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    }
};
