import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface CarData {
  emp_id: number;
  car_brand: string;
  model: string;
  license_plate: string;
  car_image: File | null;
}

interface ErrorState {
  [key: string]: string | undefined;
}

export const useCarController = (employeeId: number) => {
  const [formData, setFormData] = useState<CarData>({
    emp_id: employeeId,
    car_brand: "",
    model: "",
    license_plate: "",
    car_image: null
  });

  const [errors, setErrors] = useState<ErrorState>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ErrorState = {};
    if (!formData.car_brand.trim()) newErrors.car_brand = "ກະລຸນາປ້ອນຍີ່ຫໍ້ລົດ";
    if (!formData.model.trim()) newErrors.model = "ກະລຸນາປ້ອນຮຸ່ນລົດ";
    if (!formData.license_plate.trim()) newErrors.license_plate = "ກະລຸນາປ້ອນປ້າຍທະບຽນ";
    if (!formData.car_image) newErrors.car_image = "ກະລຸນາເລືອກຮູບລົດ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("emp_id", String(formData.emp_id));
      formDataToSend.append("car_brand", formData.car_brand);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("license_plate", formData.license_plate);
      formDataToSend.append("status", "ACTIVE");
      if (formData.car_image) formDataToSend.append("car_image", formData.car_image);

      await axios.post(
        "https://homecare-pro.onrender.com/cars/create_car",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      await Swal.fire("ສຳເລັດ!", "ບັນທຶກຂໍ້ມູນລົດສຳເລັດ", "success");

    } catch (error) {
      console.error("Error creating car:", error);
      Swal.fire("ຜິດພາດ!", "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນລົດ", "error");
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};