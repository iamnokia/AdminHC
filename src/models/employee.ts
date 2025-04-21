import { Gender } from "../enums/gender";
import { Status } from "../enums/status";

export interface EmployeeModel {
    id: string,
    first_name: string ,
    last_name: string,
    email: string,
    tel: string,
    password: string,
    address: string,
    city: string,
    gender: Gender,
    cv: string, 
    avatar: string,
    cat_id: string,
    cat_name: string;
    price: string,
    status: Status,
    created_at: string,
    updated_at: string 
}