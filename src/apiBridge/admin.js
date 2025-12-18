import axios from 'axios';

export default {
    login(args, adv) {
        return axios.post(
            import.meta.env.VITE_API_SERVER + '/api/admin/auth/login',
            {
                email: args.email,
                password: args.password
            },
            { ...adv }
        );
    },
    refreshToken(args, adv) {
        return axios.post(
            import.meta.env.VITE_API_SERVER + '/api/admin/auth/refresh-token',
            {
                refreshToken: args.refreshToken
            },
            { ...adv }
        );
    },
    logout(args, adv) {
        return axios.post(
            import.meta.env.VITE_API_SERVER + '/api/admin/auth/logout',
            {
                refreshToken: args.refreshToken
            },
            { ...adv }
        );
    },
    checkAdminAccess(args, adv) {
        const token = localStorage.getItem('adminAccessToken');
        return axios.post(
            import.meta.env.VITE_API_SERVER + '/api/admin/auth/verify',
            {},
            {
                ...adv,
                headers: {
                    ...adv?.headers,
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
};
