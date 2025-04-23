import MainLayout from "../layout";
import NotFoundPage from "../pages/404";
import CarForm from "../pages/add_car/components/car";
import EmployeeSelector from "../pages/add_car/components/emp_select";
import HomePage from "../pages/home";
import AdminLogin from "../pages/login/components/login";
import AdminRegister from "../pages/register/components/register";
import ReportsIndex from "../pages/Report";
import ServiceProviderAdmin from "../pages/show_service/components/service";
import ServiceStatusAdmin from "../pages/status/components/ServiceStatus";
import {
  CAR_PATH,
  HOME_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  REPORT_PATH,
  SERVICE_STATUS_PATH,
  SHOW_SERVICE_PATH,
  SELECT_EMPLOYEE_PATH,
} from "./path";
import { useRoutes } from "react-router-dom";

const RoutesComponent = () => {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: HOME_PATH, element: <HomePage /> },
        { path: SELECT_EMPLOYEE_PATH, element: <EmployeeSelector /> },
        { path: `${CAR_PATH}/:employeeId`, element: <CarForm /> },
        { path: REPORT_PATH, element: <ReportsIndex /> },
        { path: SHOW_SERVICE_PATH, element: <ServiceProviderAdmin /> },
        { path: SERVICE_STATUS_PATH, element: <ServiceStatusAdmin /> },
        { path: REGISTER_PATH, element: <AdminRegister /> },
        { path: LOGIN_PATH, element: <AdminLogin /> },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
};

export default RoutesComponent;

