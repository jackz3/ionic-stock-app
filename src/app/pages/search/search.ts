import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { ModalController } from '@ionic/angular'
import {LocalData} from '../../providers/local-data'
import {StockService} from '../../providers/stock'

@Component({
	templateUrl:'search.html'
})
export class SearchPage {
	q:string=''
	results:any[]=[]
	codes:string[]=[]
	constructor(private localData:LocalData,private stockService:StockService,
    private router: Router,
		private viewCtrl:ModalController
	){
		this.localData
				.getFavors()
				.subscribe(codes=>this.codes=codes)
	}

	find(){
		const q=this.q.trim()
		if(!q) 	return
		this.stockService
				.findStocks(q)
				.subscribe((results)=>{
					this.results=results.map(x=>Object.assign(x,{added:this.codes.indexOf(x.code)>=0}))
				})
	}
	dismiss(){
		this.viewCtrl.dismiss()
	}
	clear(){
		this.q=''
	}
	gotoDetails(stock){
		this.router.navigate([`/details/${stock.code}`])
		this.viewCtrl.dismiss()
	}
	addToFavors(code,evt){
		evt.stopPropagation()
		if (code) {
			this.localData.addFavor(code).then(()=>{
				const item=this.results.find(x=>x.code===code)
				if(item){
					item.added=true
				}
			})
		}
	}
}