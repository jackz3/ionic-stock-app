import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import {NavController,AlertController,LoadingController,ModalController} from '@ionic/angular';
import {LocalData} from '../../providers/local-data';
import {StockService,isOpening} from '../../providers/stock'
import {Config} from '../../providers/config'
import {SearchPage} from '../search/search';
import { Subscription, timer } from 'rxjs';
import { switchMap, filter, retry } from 'rxjs/operators'

@Component({
  templateUrl: 'details.html',
	styleUrls: ['./details.scss'],
	// directives: [StockCharts]
})
export class DetailsPage {
	code:string
	loading:HTMLIonLoadingElement
  stock:any={}
	chartType:string='minutes'
  showLoading:boolean=false
  showBuySell:boolean
  isFavor:boolean=false
	favors:string[]=[]
	stockSubscription:Subscription

  constructor(
		private route: ActivatedRoute,
		private router: Router,
		private localData:LocalData,
		private stockService:StockService,
		private config:Config,
    private nav:NavController,
    private modalCtrl: ModalController,
		private alertCtrl: AlertController,
		private loadingCtrl:LoadingController
  ) {
		this.loadingCtrl.create({
			message: '载入中...'
		}).then(res => {
			this.loading = res
			this.loading.present()
		})
	}
	ngOnInit() {
    this.route.params.subscribe(params => {
			this.code = params.code
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
		})
		// this.hero$ = this.route.paramMap.pipe(
		// 	switchMap((params: ParamMap) =>
		// 		this.service.getHero(params.get('id')))
		// );
	}
	ionViewDidLoad(){
	}
	ionViewWillEnter(){
		this.stockSubscription=timer(0, this.config.priceInterval)
			.pipe(filter(x=> x===0 || isOpening()),
						switchMap(x=>this.stockService
														.fetchDay([this.code])
														.then(()=> {
															if (this.loading.parentElement) {
																this.loading.dismiss()
															}
															return this.stockService.getStock(this.code)
														})
						),
						retry()
		)
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
	async showSearchBar(){
		const modal = await this.modalCtrl.create({
			component: SearchPage,
			componentProps:{nav: this.nav}
		})
    await modal.present()
	}
  async addRemove(){
		if(this.isFavor){
			const confirm = await this.alertCtrl.create({
      	message: '确定从自选股移除？',
      	subHeader: this.stock.name,
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
			await confirm.present()
		}else{
			await this.localData.addFavor(this.code)
			const alert = await this.alertCtrl.create({
				message: '添加自选股成功!',
				subHeader: this.stock.name,
				buttons: ['确定']
			})
			await alert.present()
		}
	}
	updateChart() {
		console.log(this.chartType)
	}
}