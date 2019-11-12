import { gender } from './Gender';
import { Designation } from './Designation';
export interface BasicEmployee {
    id: number;
    employeeCode: number;
    firstName: string;
    middleName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
    gender: gender;
    designation: Designation;
}
