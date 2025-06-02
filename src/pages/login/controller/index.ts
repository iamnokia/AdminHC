// src/pages/login/controller/Controller.ts
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH, SHOW_SERVICE_PATH } from "../../../routes/path";

const useLoginController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Using the endpoint from the API documentation
      const res = await axios.post("https://homecare-pro.onrender.com/admins/sign_in", { 
        email, 
        password 
      });
      
      const token = `Bearer ${res.data.access_token}`;
      const refreshToken = `Bearer ${res.data.refresh_token}`;
      
      axios.defaults.headers.common["Authorization"] = token;
      
      localStorage.setItem(
        'authToken',
        JSON.stringify({
          accessToken: token,
          refreshToken: refreshToken,
        })
      );

      // Get user profile data if needed
      // Note: This may need adjustment based on your API structure
      try {
        const userRes = await axios.get('https://homecare-pro.onrender.com/admins/read_all_admins');
        // Combine all user data into a single object
        const combinedUserData = {
          ...res.data,
          ...userRes.data,
          token,
          refreshToken
        };
        dispatch(loginSuccess(combinedUserData));
      } catch (profileErr) {
        // If profile fetch fails, just use the login response data
        dispatch(loginSuccess({
          ...res.data,
          token,
          refreshToken
        }));
      }
      
      navigate(SHOW_SERVICE_PATH);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Server error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  return {
    email,
    password,
    showPassword,
    loading,
    error,
    handleClickShowPassword,
    handleSubmit,
    handleChangeEmail,
    handleChangePassword
  };
};

export default useLoginController;