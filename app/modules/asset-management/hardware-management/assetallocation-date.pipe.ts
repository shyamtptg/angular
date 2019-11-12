import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assetallocationDate'
})
export class AssetAllocationDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = value.getDay();
    const month = value.getMonth();
    const monthname = monthNames[month];
    if (value === '' || value === undefined) {
      return null;
    }
    return (day === 1 ? day + 'st' : day === 2 ? day + 'nd' : day === 3 ? day + 'rd' : day + 'th') + monthname;
  }

}
