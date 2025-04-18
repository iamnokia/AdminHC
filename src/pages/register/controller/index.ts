import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LOGIN_PATH } from "../../../routes/path";
import axiosInstance from "../../../configs/axios";

const useMainController = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Passwords do not match!',
        });
        return;
      }
  
      setLoading(true);
      const response = await axiosInstance.post("/register", {
        username: userName,
        email,
        password,
        confirmPassword
      });
  
      console.log(response.data);
  
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Register Success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate(LOGIN_PATH);
      });
      
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
        console.error("Axios error:", errorMessage);
      } else {
        console.error("An unexpected error occurred:", error);
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMessage,
      });
  
    } finally {
      setLoading(false);
    }
  };

  return {
    userName,
    password,
    showPassword,
    setShowPassword,
    loading,
    setLoading,
    email,
    setEmail,
    confirmPassword,
    setConfirmPassword,
    handleChangeUsername: (value: string) => setUserName(value),
    handleChangeEmail: (value: string) => setEmail(value),
    handleChangePassword: (value: string) => setPassword(value),
    handleChangeConfirmPassword: (value: string) => setConfirmPassword(value),
    handleClickShowPassword,
    handleSubmit
  };
};

export default useMainController;
