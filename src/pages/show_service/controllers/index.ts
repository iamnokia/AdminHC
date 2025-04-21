import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeModel } from "../../../models/employee";
import axios from "axios";
import { CarModel } from "../../../models/car";

const useMainController = () => {
  const [data, setData] = useState<EmployeeModel[]>([]);
  const [car, setCar] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleGetAllData = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://homecare-pro.onrender.com/employees/read_employees",
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError("Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCarByCatId = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://homecare-pro.onrender.com/employees/read_emp_car_employees/5",
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setCar(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      console.error("Error fetching car data:", error);
      setError("Failed to fetch car data");
    } finally {
      setLoading(false);
    }
  };

  // Combine employee and car data
  const getCombinedData = (): ServiceProvider[] => {
    return data.map(employee => {
      const employeeCar = car.find(c => c.emp_id === employee.id);
      return {
        ...employee,
        categoryType: getCategoryType(employee.cat_name),
        car: employeeCar
      };
    });
  };

  // Map category name to category type
  const getCategoryType = (catName: string | undefined): string => {
    const normalizedName = (catName || '').toLowerCase();
    
    if (normalizedName.includes('cleaning') || normalizedName.includes('ທຳຄວາມສະອາດ')) return 'cleaning';
    if (normalizedName.includes('electrical') || normalizedName.includes('ໄຟຟ້າ')) return 'electrical';
    if (normalizedName.includes('aircon') || normalizedName.includes('air') || normalizedName.includes('ແອ')) return 'aircon';
    if (normalizedName.includes('plumbing') || normalizedName.includes('ປະປາ')) return 'plumbing';
    if (normalizedName.includes('moving') || normalizedName.includes('ຂົນສົ່ງ')) return 'moving';
    if (normalizedName.includes('bathroom') || normalizedName.includes('ຫ້ອງນ້ຳ')) return 'bathroom';
    if (normalizedName.includes('pest') || normalizedName.includes('ກຳຈັດແມງໄມ້')) return 'pest';
    return 'other';
  };

  useEffect(() => {
    handleGetAllData();
    handleGetCarByCatId();
  }, []);

  return {
    loading,
    error,
    serviceProviders: getCombinedData(),
    handleNavigate
  };
};

export default useMainController;

interface ServiceProvider extends Omit<EmployeeModel, 'price'> {
  price: number;
  categoryType: string;
  car?: CarModel;
}