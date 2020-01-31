import { Component } from '@angular/core'
import {NavController, ModalController, NavParams} from '@ionic/angular'
import {LocalData} from '../../providers/local-data'
import {StockService} from '../../providers/stock'

@Component({
	templateUrl:'search.html'
})
export class SearchPage {
	q:string=''
	results:any[]=[]
	codes:string[]=[]
	nav:NavController
	constructor(private localData:LocalData,private stockService:StockService,
    private navParams:NavParams,
		private viewCtrl:ModalController
	){
		this.nav=this.navParams.get('nav')
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
	clear(e){
		this.q=''
	}
	gotoDetail(stock){
		this.viewCtrl.dismiss()
		// this.nav.push(DetailsPage,{code:stock.code})
	}
	addToFavors(code,evt){
		this.localData.addFavor(code).then(()=>{
			const item=this.results.find(x=>x.code===code)
			if(item){
				item.added=true
			}
		})
		evt.stopPropagation()
	}
}