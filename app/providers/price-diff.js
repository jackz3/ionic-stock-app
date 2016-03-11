import {Pipe} from 'angular2/core'

@Pipe({
	name: 'PriceDiff'
})
export class PriceDiff{
	transform(value) {
		if(isNaN(value)) return '';
		return (value>0?'+':'')+value.toFixed(2);
	}
}