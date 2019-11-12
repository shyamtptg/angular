/*
* Mocked service classes to use in application to test isolately
* @author: cmarasani on 11/21/2018
*/
import { Observable } from 'rxjs';

/* AuthService */
export class MockAuthService {
    test: string = 'test';
    constructor() {}
}

/* LoaderService */
export class MockLoaderService {
    isLoaded: boolean = false;
}

/* DialogService */
export class MockDialogService {
    render = Observable.create((observer) => {
        observer.complete();
    });
}

/* CommonService */
export class MockCommonService {
    getItem(a) {
        return a;
    }
}

/* AppConstants */
export class MockAppConstants {
  test: string = 'test';
}

/* HeaderService */
export class MockHeaderService {
  test: string = 'test';
}

/* LeaveManagementService */
export class MockLeaveManagementService {
    getToken() {
        return 'token';
    }
}

/* ErrorHandleService */
export class MockErrorHandleService {
    test: string = 'test';
}
