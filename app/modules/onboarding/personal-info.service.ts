import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';


export class StateObject {
  isBasic: boolean | false;
  isContact: boolean | false;
  isFinancial: boolean | false;
  isEmergency: boolean | false;
  formData: any | {};
}

@Injectable()
export class PersonalInfoService {
  constructor() { }
  subject = [];
  finalform = [];
  $isValidForm = new Subject<{isValidForm: boolean, empinfo: any}>();
  officialForm = new Subject< {isValidForm: boolean, offcialInfo: any}>();
  $emergencyInfoset = new Subject<{emergencyinfo}>();
  $selectIndexValue = new BehaviorSubject<{indexvalue: any}>({
    indexvalue: 0
  });

  stateObj = new BehaviorSubject<StateObject>({
    isBasic: false,
    isContact: false,
    isFinancial: false,
    isEmergency: false,
    formData: {}
  });
  setState(updatedState: any) {
    this.stateObj.next(updatedState);
  }
  sendbasicInfo(basicinfo: any) {
      this.subject = [...basicinfo];
  }

  setValidFormStatus(value: boolean, employeeinfo: any) {
    return this.$isValidForm.next({isValidForm: value,  empinfo: employeeinfo});
  }
  setfinalForm(finalformInfo: any) {
    this.finalform = [...finalformInfo];
  }
  setofficialInfo(value: boolean, officialformInfo: any) {
    return this.officialForm.next({isValidForm: value, offcialInfo: officialformInfo});

  }
  setemergencyInfo(info: any) {
    return this.$emergencyInfoset.next({emergencyinfo: info});
  }

  setIndexValue(value: any) {
    return this.$selectIndexValue.next({indexvalue: value});

  }

  }
