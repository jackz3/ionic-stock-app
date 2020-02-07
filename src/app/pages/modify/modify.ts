import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { ModalController, AlertController } from '@ionic/angular'
import {LocalData} from '../../providers/local-data'
import {StockService} from '../../providers/stock';
import {SearchPage} from '../search/search';

@Component({
  templateUrl: 'modify.html',
})
export class ModifyPage {
  stocks:any[]=[]
  codes:string[]=[]
  constructor (
    private localData:LocalData,
    private stockService:StockService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router) {
  }
  ionViewWillEnter(){
    this.codes=this.localData.getFavorsSnap()
    this.stocks=this.stockService.getStocks(this.codes)
  }
  gotoDetails (code) {
    this.router.navigate([`/details/${code}`])
  }
	async onRemove(stock,evt){
    evt.stopPropagation()
		const confirm = await this.alertCtrl.create({
      	message: '确定从自选股移除？',
      	subHeader: stock.name,
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
			await confirm.present()
  }
	async showSearchBar(){
		const modal = await this.modalCtrl.create({
      component: SearchPage
    })
    await modal.present()
  }
  reorderItems(ev) {
    ev.preventDefault()
    this.stocks = ev.detail.complete(this.stocks)
    this.localData.save(this.stocks.map(x => x.code))
  }
}