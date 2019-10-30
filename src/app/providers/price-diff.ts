import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'priceDiff'})
export class PriceDiff implements PipeTransform{
	transform(value) {
		if(isNaN(value)) return '';
		return (value>0?'+':'')+value.toFixed(2);
	}
}
