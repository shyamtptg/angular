import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'recruiterFilter'
})

export class AssignExecutiveFilterPipe implements PipeTransform {
	transform(items: any, search: any): any {
		if (search === undefined) return items;
		return items.filter(function (item: any) {
			return item.recruiterName.toLowerCase().includes(search.toLowerCase());
		})
	}
}