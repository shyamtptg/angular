import { Injectable } from '@angular/core';
@Injectable()
export class LoaderService {
    public isLoaded: boolean;
    constructor() { }

    showLoading(className: string = 'overlay', id: string = '#overlay') {
        this.isLoaded = true;
        $(id).addClass(className);
        $(id).fadeIn('fast');
    }
    hideLoading(className: string = 'overlay', id: string = '#overlay') {
        this.isLoaded = false;
        $(id).fadeOut('fast');
        $(id).removeClass(className);
    }
}
