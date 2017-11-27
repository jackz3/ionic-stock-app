import { Component } from '@angular/core';
import {NavController,ModalController,LoadingController,AlertController,reorderArray} from 'ionic-angular'
import {LocalData} from '../../providers/local-data'
import {StockService} from '../../providers/stock';
//import {Detail} from '../detail/detail';
import {SearchPage} from '../search/search';

@Component({
  templateUrl: 'modify.html',
})
export class ModifyPage {
  stocks:any[]=[]
  codes:string[]=[]
  constructor(
    private localData:LocalData,
    private stockService:StockService,
    // @Inject(forwardRef(() => MenuService))
    // private menuService:MenuService,
    //private nav:NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController){
  }
  ionViewWillEnter(){
    this.codes=this.localData.getFavorsSnap()
    this.stocks=this.stockService.getStocks(this.codes)
  }
  gotoDetail(stock){
		//this.nav.push(Detail,{code:stock.code})
  }
	onRemove(stock,evt){
		const confirm = this.alertCtrl.create({
      	title: '确定从自选股移除？',
      	message: stock.name,
      	buttons: [
        {
          text: '取消'
        },
        {
          text: '确定',
          handler: () => {
            this.localData.removeFavor(stock.code)
							      .then((index)=>{
                      this.codes.splice(index,1)
                      this.stocks.splice(index,1)
                    })
          }
        }]
    	});
			confirm.present()
			evt.stopPropagation()
  }
	showSearchBar(){
		const modal = this.modalCtrl.create(SearchPage)
    modal.present()
  }
  reorderItems(indexes) {
    const element = this.codes[indexes.from]
    this.codes.splice(indexes.from, 1)
    this.codes.splice(indexes.to, 0, element)
    this.localData.save(this.codes)
    this.stocks = reorderArray(this.stocks, indexes)
  }
}