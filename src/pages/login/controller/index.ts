import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH } from "../../../routes/path";

const useMainController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUserName] = useState<string>(null!);
  const [password, setPassword] = useState<string>(null!);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChangeusername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

   const handleLogin = async (username: string, password: string) => {
    let loading = false;
    let error = '';

    const setLoading = (value: boolean) => { loading = value; };
    const setError = (value: string) => { error = value; };

    try {
      setLoading(true);
      const res = await axios.post("https://freelancer-jhrh.onrender.com/auth/login", { username, password });
      
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

      const userRes = await axios.get('/profile/read');
      const userData = userRes.data; 

      // Combine all user data into a single object
      const combinedUserData = {
        ...res.data,
        ...userData,
        token,
        refreshToken
      };

      dispatch(loginSuccess(combinedUserData));
      navigate(HOME_PATH);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Server error, please try again later");
    } finally {
      setLoading(false);
    }

    return { loading, error };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return {
    username,
    password,
    showPassword,
    setShowPassword,
    loading,
    setLoading,
    handleClickShowPassword,
    handleSubmit,
    handleChangeusername,
    handleChangePassword
  };
};

export default useMainController;
