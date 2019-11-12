import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../config/app.constants';
import { HiringRequestDetails } from '../models/hiring-request-details';
import { JobDescriptionDetails } from '../models/job-description';

@Injectable()
export class NewHiringRequestDataService {
    private hiringRequestData: HiringRequestDetails;
    private hiringData: HiringRequestDetails;
    private jobDescTemplateData: JobDescriptionDetails;
    public mode: string;
    constructor(private appConstants: AppConstants) {
        this.hiringRequestData = null;
        this.jobDescTemplateData = null;
    }
    loadHiringRequestData = () => {
        const data = require('./../models/hiringRequestInitialData.json');
        this.hiringRequestData = (data) ? <HiringRequestDetails>data : undefined;
    }
    loadHiringRequestDataById = (id: string) => {
        const data = require('./../models/hiringRequestData.json');
        this.hiringRequestData = (data) ? <HiringRequestDetails>data : undefined;
    }
    getHiringRequestData = () => {
        return (this.hiringRequestData) ? Object.assign({}, this.hiringRequestData) : undefined;
    }
    updateHiringDetailsData = (detailsFrmHiringRequestData: any) => {
         this.hiringData = detailsFrmHiringRequestData;
    }
    getHiringSummaryData = () => {
        return (this.hiringRequestData) ? Object.assign({}, this.hiringRequestData) : undefined;
    }
    loadJobDescriptionTemplateData = () => {
        const data = require( './../models/jobDescription.json');
        this.jobDescTemplateData = (data) ? <JobDescriptionDetails>data : undefined;
    }
    getJobDescriptionTemplateData = () => {
        return (this.jobDescTemplateData) ? Object.assign({}, this.jobDescTemplateData) : undefined;
    }
}
