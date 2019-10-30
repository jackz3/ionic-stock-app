import { Component } from '@angular/core';
import {NavController,ModalController,LoadingController} from '@ionic/angular'
import { Router } from '@angular/router'
import {LocalData} from '../../providers/local-data'
import {StockService,isOpening} from '../../providers/stock'
import {DetailsPage} from '../details/details'
import {SearchPage} from '../search/search'
import {ModifyPage} from '../modify/modify'
import { interval, Subscription, timer, merge } from 'rxjs'
import { switchMap, filter, retry } from 'rxjs/operators'
// import 'rxjs/add/observable/merge'
// import 'rxjs/add/operator/filter'
// import 'rxjs/add/operator/switchMap'
// import 'rxjs/add/operator/retry'
// import { interval } from 'rxjs/observable/interval';
// import { Subscription } from 'rxjs/Subscription';
// import { timer } from 'rxjs/observable/timer';
// import { Loading } from '@ionic/angular/components/loading/loading';

const INTERVAL=8000

//@Component({
//  selector: 'page-home',
//})
//@IonicPage()
@Component({
	templateUrl: 'home.html',
	styleUrls: ['./home.scss']
})
export class HomePage {
	type:string='favors'
	showLoading:boolean=true
	stocks:any[]=[]
	segment = 'INCREASE'
	codes:string[]=[]
	subscription:Subscription
	loading:HTMLIonLoadingElement

  constructor(
		private localData:LocalData,
		private stockService:StockService,
		private nav:NavController,
		// private navParams:NavParams,
		private loadingCtrl:LoadingController,
		private modalCtrl: ModalController,
		private router: Router
	){
		this.type= 'favors'// this.navParams.get('type')||'favors'
  }
	async ionViewWillEnter(){
		this.loading = await this.loadingCtrl.create({
			message: '载入中...'
		})
		await this.loading.present()
		let firstLoad=true

		if(this.type==='favors'){
			this.subscription = merge(
			this.localData.getFavors(),
			interval(INTERVAL)
		).pipe(filter(x=>{
			if(typeof(x)==='object'){
				this.codes=x
				return true
			}
			return isOpening()
		}), switchMap(x=>this.stockService
											.fetchDay(this.codes)
											.then(()=>this.stockService.getStocks(this.codes))
			), retry())
			.subscribe(stocks=>{
				if(firstLoad){
					firstLoad=false
					this.loading.dismiss().catch()
				}
				this.stocks=stocks
			})
		}else if(this.type==='boards'){
			this.subscription=timer(0,INTERVAL).pipe(filter(x=>{
				if(x===0){
					return true
				}
				return isOpening()
			}), switchMap(x=>this.stockService.fetchRankings(this.segment)), retry())
				.subscribe(x=>{
					if(firstLoad){
						firstLoad=false
						this.loading.dismiss().catch()
					}
					this.stocks=x})
		}
	}
	ionViewDidEnter(){
		if(this.showLoading){
		//	this.loading = this.loading.create({
    //		content: '载入中...'
  	//	})
		//	this.nav.present(this.loading)
		}
	}
	ionViewWillLeave(){
		if(this.subscription){
			this.subscription.unsubscribe()
		}
	}
  // gotoDetail(stock){
		// this.nav.push(DetailsPage,{code:stock.code})
  // }
	// gotoModify(){
	// 	this.nav.push(ModifyPage)
	// }
	async showSearchBar(){
		const modal = await this.modalCtrl.create({
			component: SearchPage,
			componentProps: {nav:this.nav}
		})
    await modal.present()
	}
	updateSeg(){
		this.stockService.fetchRankings(this.segment)
					.then(x=>this.stocks=x)
	}
}
