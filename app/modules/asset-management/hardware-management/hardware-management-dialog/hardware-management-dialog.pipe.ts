import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dialogpipe'
})
export class DialogpipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const keys = [];
    if (value === '' || value === undefined) {
      return null;
    }
    for (const field of Object.keys(value)) {
      keys.push(field);
    }
    return keys;
  }

}
