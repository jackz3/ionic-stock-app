import { Component, ViewChild,ElementRef } from '@angular/core'
import {NavParams,NavController,AlertController,LoadingController,ModalController} from 'ionic-angular';
import {LocalData} from '../../providers/local-data';
import {StockService,isOpening} from '../../providers/stock'
import {Config} from '../../providers/config'
import {SearchPage} from '../search/search';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';
import { Loading } from 'ionic-angular/components/loading/loading'
import 'rxjs/add/observable/from'

@Component({
  templateUrl: 'details.html',
//	directives: [StockCharts]
})
export class DetailsPage {
	code:string
	loading: Loading
  stock:any={}
	chartType:string='minutes'
  showLoading:boolean=false
  showBuySell:boolean
  isFavor:boolean=false
	favors:string[]=[]
	stockSubscription:Subscription
	@ViewChild('stockChart') chartRef: ElementRef

  constructor(
		private localData:LocalData,
		private stockService:StockService,
		private config:Config,
    navParams:NavParams,
    private nav:NavController,
    private modalCtrl: ModalController,
		private alertCtrl: AlertController,
		loadingCtrl:LoadingController
  ){
		this.code=navParams.get('code')
		this.loading = loadingCtrl.create({
    	content: '载入中...'
  	})
		if(this.code==='sh000001' || this.code.slice(0,5)==='sz399'){
			this.showBuySell=false
		}else{
			this.showBuySell=true
		}
		this.localData.getFavors()
						.subscribe(x=>{
							this.favors=x
							this.isFavor=x.includes(this.code)
						})
  }
	ionViewDidLoad(){
	}
	ionViewWillEnter(){
		this.stockSubscription=timer(0, this.config.priceInterval)
													.filter(x=> x===0 || isOpening())
													.switchMap(x=>this.stockService
																						.fetchDay([this.code])
																						.then(()=>this.stockService.getStock(this.code))
													)
													.retry()
													.subscribe(stock=>{
														this.stock=stock
													})
	}
	ionViewDidEnter(){
		// console.log('enter')
	}
	ionViewWillLeave(){
		this.stockSubscription.unsubscribe()
	}
	showSearchBar(){
		const modal = this.modalCtrl.create(SearchPage,{nav:this.nav})
    modal.present()
	}
  addRemove(){
		if(this.isFavor){
			let confirm = this.alertCtrl.create({
      	title: '确定从自选股移除？',
      	message: this.stock.name,
      	buttons: [
        {
          text: '取消'
          // handler: () => { }
        },
        {
          text: '确定',
          handler: () => {
            this.localData.removeFavor(this.code)
          }
        }
      	]
    	});
			confirm.present()
		}else{
			this.localData
					.addFavor(this.code)
					.then(()=>{
							const alert = this.alertCtrl.create({
      					title: '添加自选股成功!',
      					subTitle: this.stock.name,
      					buttons: ['确定']
    					})
    					alert.present()
					})
		}
	}
	updateChart() {
		console.log(this.chartType)
	}
}