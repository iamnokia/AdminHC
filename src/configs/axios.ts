import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://freelancer-jhrh.onrender.com/auth/",

});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const storedTokens = JSON.parse(localStorage.getItem('authToken') || "");
                axios.defaults.headers.common["Authorization"] = `${(
                    storedTokens.refreshToken
                )}`;

                const res = await axios.post("https://freelancer-jhrh.onrender.com/auth/" + "/contact/refreshToken");

                const newAccessToken: string = "Bearer " + res?.data?.access_token;
                const newRefreshToken: string = "Bearer " + res?.data?.refresh_token;
                axios.defaults.headers.common["Authorization"] = newAccessToken;

                localStorage.setItem(
                    'authToken',
                    JSON.stringify({
                        accessToken: (newAccessToken),
                        refreshToken: (newRefreshToken),
                    })
                );
                console.log('1');
                originalRequest.headers.Authorization = newAccessToken;
                console.log('2');
                axiosInstance.defaults.headers.common["Authorization"] = newAccessToken;
                console.log('3');

                // Retry the original request with the new access token
                return axiosInstance(originalRequest);
            } catch (error) {

                // Clear local storage and redirect to login page
                if (window.confirm("Session Expired, You need to logout")) {
                    localStorage.clear();
                    window.location.href = '/';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
