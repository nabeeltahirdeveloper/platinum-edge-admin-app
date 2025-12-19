import axios from 'axios';

// Create an axios instance with default timeout
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
});

export default axiosInstance;
