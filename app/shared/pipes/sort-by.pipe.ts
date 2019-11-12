import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(array: any, key: string, asc: boolean): any[] {
        if (!Array.isArray(array)) {
            return;
        }
        array.sort((a: any, b: any) => {
            if (a[key] < b[key]) {
              return -1;
            } else if (a[key] > b[key]) {
              return 1;
            } else {
              return 0;
            }
        });

        return asc ? array : array.reverse();
    }
}
