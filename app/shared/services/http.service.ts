import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType, URLSearchParams } from '@angular/http';
import { AppConfig } from '../../config/app.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpService {
  constructor(
    private _http: Http
  ) { }

  send(url: string, method: string, payload?: any, headersObject?: Object, responseType?: string/*, searchParams? : Object*/) {
    let headers = new Headers(headersObject);
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    if (responseType == 'ArrayBuffer') {
      options = new RequestOptions({ headers: headers, withCredentials: true, responseType: ResponseContentType.ArrayBuffer });
    }
    /*if(searchParams){
     let params: URLSearchParams = new URLSearchParams();
     for (var key in searchParams) {
      if (searchParams.hasOwnProperty(key)) {
         params.set(key, searchParams[key]);
      }
     }
     options.search = params;
    }*/
    method = method.toUpperCase();
    var self = this;
    if (method == 'GET') {
      return self._http.get(url, options).catch((error: any) => {
        try {
          if(error['_body'] instanceof ArrayBuffer){
            var decodedString = String.fromCharCode.apply(null, new Uint8Array(error['_body']));
            var error = JSON.parse(decodedString);
            return Observable.throw(new Error((error.errorMessage? error.errorMessage : error.message) || 'This request has no response data available'));
          }
          if (error.json()) {
            if (error.status === 500) {
              if(error.json().message == 'GENERAL'){
                return Observable.throw(new Error('A problem was encountered on the server. Please try after some time.'));
              }
              return Observable.throw(new Error((error.json().errorMessage? error.json().errorMessage : error.json().message)));
            }
            else if (error.status === 400) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            } else if (error.status === 401) {
              if (error.json().error === 'invalid_token') {
                return Observable.throw(new Error(error.json().error));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 403) {
              if (error.json().error == 'access_denied') {
                return Observable.throw(new Error('Access is Denied'));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 404){
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 409) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 406) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else{
              return Observable.throw(new Error(error.json().errorMessage || error.json().message || "Your request can't be completed right now. Please try again later."));
            }
          } else {
            return Observable.throw(new Error("Your request can't be completed right now. Please try again later."));
          }
        } catch (err) {
          return Observable.throw(new Error("Your request can't be completed right now. Please try again later."));
        }
      });
    } else if (method == 'POST') {
      return self._http.post(url, payload, options).map(response => response).catch((error: any) => {
        try {
          if (error.json()) {
            if (error.status === 500) {
              if(error.json().message == 'GENERAL'){
                return Observable.throw(new Error('A problem was encountered on the server. Please try after some time.'));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 400) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            } else if (error.status === 401) {
              if (error.json().error === 'invalid_token') {
                return Observable.throw(new Error(error.json().error));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 403) {
              if (error.json().error == 'access_denied') {
                return Observable.throw(new Error('Access is Denied'));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 404){
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 409) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 406) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else{
              return Observable.throw(new Error(error.json().errorMessage || error.json().message || "Your request can't be completed right now. Please try again later."));
            }
          } else {
            return Observable.throw(new Error("Your request can't be completed right now. Please try again later."));
          }
        } catch (err) {
          return Observable.throw(new Error(err.message));
        }
      });
    } else if (method == 'PUT') {
      return self._http.put(url, payload, options).map(response => response).catch((error: any) => {
        try {
          if (error.json()) {
            if (error.status === 500) {
              if(error.json().message == 'GENERAL'){
                return Observable.throw(new Error('A problem was encountered on the server. Please try after some time.'));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 400) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            } else if (error.status === 401) {
              if (error.json().error === 'invalid_token') {
                return Observable.throw(new Error(error.json().error));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 403) {
              if (error.json().error == 'access_denied') {
                return Observable.throw(new Error('Access is Denied'));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 404){
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 409) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 406) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else{
              return Observable.throw(new Error(error.json().errorMessage || error.json().message || "Your request can't be completed right now. Please try again later."));
            }
          } else {
            return Observable.throw(new Error("Your request can't be completed right now. Please try again later."));
          }
        } catch (err) {
          return Observable.throw(new Error(err.message));
        }
      });
    }
    else if (method == 'DELETE') {
      return self._http.delete(url, options).map(response => response).catch((error: any) => {
        try {
          if (error.json()) {
            if (error.status === 500) {
              if(error.json().message == 'GENERAL'){
                return Observable.throw(new Error('A problem was encountered on the server. Please try after some time.'));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 400) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            } else if (error.status === 401) {
              if (error.json().error === 'invalid_token') {
                return Observable.throw(new Error(error.json().error));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 403) {
              if (error.json().error == 'access_denied') {
                return Observable.throw(new Error('Access is Denied'));
              }
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 404){
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 409) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else if (error.status === 406) {
              return Observable.throw(new Error(error.json().errorMessage || error.json().message));
            }
            else{
              return Observable.throw(new Error(error.json().errorMessage || error.json().message || "Your request can't be completed right now. Please try again later."));
            }
          } else {
            return Observable.throw(new Error("Your request can't be completed right now. Please try again later."));
          }
        } catch (err) {
          return Observable.throw(new Error(err.message));
        }
      });
    }
  }

  /*
  * Gets reponse from a local file
  */
  getMockData(file) {
    const self = this;
    return self._http.get('/assets/mocks/' + file).catch((error: any) => {
      return Observable.throw(new Error('Something went wrong..!'));
    });
  }
}
