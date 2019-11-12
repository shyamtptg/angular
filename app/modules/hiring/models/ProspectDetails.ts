import { PersonalDetails }  from './PersonalDetails';
export interface ProspectDetails {
     id: string,
     displayName: string,
     recruiterName: string,
     referenceName: string,
     personal: PersonalDetails
}