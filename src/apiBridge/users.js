import axiosInstance from './axiosConfig';

export default {
    getUsers(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'getUsers',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    updateUser(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'updateUser',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    updateUserKYCStatus(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'updateUserKYCStatus',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    updateUserAccountStatus(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'updateUserAccountStatus',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    updateUserServices(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'updateUserServices',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    },
    updateUserNotes(args, adv) {
        return axiosInstance.post(
            import.meta.env.VITE_API_SERVER + '/api/settings/user',
            {
                action: 'updateUserNotes',
                ...args,
                token: localStorage.getItem('token'),
            },
            { ...adv }
        );
    }
};
