import { IPersonal } from './personal.interface';
export class Personal implements IPersonal {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public personalEmail: string,
        public mobileNumber: number,
        public dateOfBirth: string,
        public nationality: string,
        public isSingleAddress: boolean,
        public plotNumber: string,
        public streetName: string,
        public city: string,
        public state: string,
        public country: string,
        public zipcode: number) {
    }
}