import { Address } from './Address';
export interface PersonalDetails {
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    mobileNumber: string,
    dateOfBirth: number,
    nationality: string,
    address: {
        "currentAddress": Address,
        "permanentAddressSameAsCurrentAddress": boolean,
        "permanentAddress": Address
    }
}
