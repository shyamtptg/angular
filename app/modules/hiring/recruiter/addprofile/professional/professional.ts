import { IProfessional } from './professional.interface';

export class Professional implements IProfessional {
    constructor(
        public isVisaHolder: string,
        public nameInVisa: string,
        public visaNumber: string,
        public visaType: string,     
        public exitDate: string,
        public remarks: string) {
    }
}