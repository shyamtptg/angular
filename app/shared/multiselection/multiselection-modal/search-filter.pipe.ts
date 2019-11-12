import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'searchFilter'
})

export class SearchFilterPipe implements PipeTransform {
	transform(items: any, search: any): any {
		if (search === undefined) return items;
		return items.filter(function (item: any) {
			return item.name.toLowerCase().includes(search.toLowerCase());
		})
	}
}