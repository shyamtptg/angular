import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { LoaderService } from '../../shared/services/loader.service';
import { AuthService } from '../services/auth.service';
import { DialogService } from './../dialogs/dialog.service';
@Injectable()

export class ErrorHandleService {
    public errorStatus;
    public errorBody;
    flag: boolean = false;
    constructor(
        public loaderService: LoaderService,
        public authService: AuthService,
        private dialogService: DialogService
    ) {}

    public erretxt: any;
    handleErrors(error) {
        this.errorBody = '';
        this.errorStatus = '';
        try {
            if (error['_body']) {
                try {
                    this.errorBody = JSON.parse(error['_body']);
                } catch (error) {
                    throw ('A problem was encountered on the server. Please try after some time.');
                }
                this.errorStatus = error.status;
                if (this.errorStatus && this.errorBody) {
                    this.throwError(this.errorBody);
                } else {
                    throw ("A problem was encountered on the server. Please try after some time.")
                }
            } else {
                if (error.message) {
                    if (error.message === 'invalid_token') {
                        this.errorStatus = 401;
                        this.errorBody = {
                            error: 'invalid_token'
                        };
                        throw ('Session has expired. Please logout and login again.');
                    } else {
                        throw (error.message);
                    }
                } else {
                    throw ("A problem was encountered on the server. Please try after some time.");
                }
            }
        } catch (error) {
            this.loaderService.hideLoading();
            if (!this.flag) {
                this.flag = true;
                this.dialogService.render(
                    [{
                        title: 'Hold On!',
                        message: error,
                        yesLabel: 'OK'
                    }],
                    'auto'
                ).subscribe(result => {
                    this.flag = false;
                    if (result) {
                        if (this.errorStatus === 401 && this.errorBody.error === 'invalid_token') {
                            this.authService.logout();
                        }
                    }
                });
            }
        }
    }

    throwError(errorBody: any) {
        if (this.errorStatus === 500 && errorBody.message === 'GENERAL') {
            throw ('A problem was encountered on the server. Please try after some time.');
        } else if (this.errorStatus === 401 && errorBody.error === 'invalid_token') {
            throw ('Session is expired. Please logout and login again');
        } else if (this.errorStatus === 403 && errorBody.error === 'access_denied') {
            throw('Access is Denied');
        } else {
            throw (this.errorBody.errorMessage || errorBody.message || "A problem was encountered on the server. Please try after some time.");
        }
    }
}
