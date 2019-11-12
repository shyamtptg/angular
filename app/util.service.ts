import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() { }

  
  epochToDate(date) {
    if (typeof (date) == "string") {
        date = parseInt(date)
    }
    var d = new Date(date),
        month = '' + (d.getUTCMonth() + 1),
        day = '' + d.getUTCDate(),
        year = d.getUTCFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
  }
}
