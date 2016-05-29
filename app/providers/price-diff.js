import {Pipe} from '@angular/core'

@Pipe({
	name: 'PriceDiff'
})
export class PriceDiff{
	transform(value) {
		if(isNaN(value)) return '';
		return (value>0?'+':'')+value.toFixed(2);
	}
}