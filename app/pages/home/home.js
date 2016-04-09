import {Page,NavController,NavParams,Modal,Loading} from 'ionic-angular';
import {LocalData} from '../../providers/local-data';
import {StockService,CLOSE_INCREASE,CLOSE_DECLINE} from '../../providers/stock';
import {MenuService} from '../../providers/menu';
import {PriceDiff} from '../../providers/price-diff';
import {Detail} from '../detail/detail';
import {Search} from '../search/search';

const INTERVAL=8000;

@Page({
  templateUrl: 'build/pages/home/home.html',
	pipes: [PriceDiff]
})
export class Home {
  static get parameters() {
    return [[LocalData],[StockService],[MenuService],[NavController],[NavParams]];
  }
  constructor(localData,stockService,menuService,nav,navParams){
    this.localData=localData;
    this.stockService=stockService;
		this.menuService=menuService;
		this.nav=nav;
		this.type=navParams.get('type')||'favors';
		this.timer=0;
		switch(this.type){
			case CLOSE_INCREASE:
				this.title='涨幅榜'
				break;
			case CLOSE_DECLINE:
				this.title='跌幅榜'
				break;
			default:
				this.title='自选股'	
		}
		this.showLoading=true;
  }
	onPageWillEnter(){
		this.polling();
	}
	onPageDidEnter(){
		if(this.showLoading){
			this.loading = Loading.create({
    		content: '载入中...'
  		});
			this.nav.present(this.loading);
		}
		this.menuService.buildMenu(this.type);
	}
	onPageWillLeave(){
	  this.clearTimer();
	}
	polling(){
	  if(this.stockService.isOpening()){
      if(this.type==='favors'){
        this.fetchDay();
      }else{
        this.fetchRankings(this.type);
      }
      this.timer=setTimeout(this.polling.bind(this),INTERVAL);
    }else{
      this.clearTimer();
      if(this.type==='favors'){
				let codes=this.localData.getFavors();
        if(!this.stockService.hasStocks(codes)){
					return this.fetchDay();
				}
      }else{
      	if(!this.stockService.hasRankings(this.type)){
					return this.fetchRankings(this.type);
				}
      }
			this.setStocks();
    }
	}
	clearTimer(){
	  if(this.timer){
      clearTimeout(this.timer);
    }
	}
	setStocks(){
		if(this.showLoading){
			this.showLoading=false;
			if(this.loading){
				this.loading.dismiss();
			}
		}
	  if(this.type==='favors'){
      let codes=this.localData.getFavors();
      this.stocks=this.stockService.getStocks(codes);
	  }else{
	    this.stocks=this.stockService.getStockRankings(this.type);
	  }
	}
	fetchRankings(sort){
		this.stockService.fetchRankings(sort).then(()=>{
		  this.setStocks();
		});
	}
  fetchDay(stocks){
		let codes=this.localData.getFavors();
    this.stockService.fetchDay(codes).then(()=>{
			this.setStocks();
		});
  }
  gotoDetail(stock){
		this.nav.push(Detail,{code:stock.code});
  }
	showSearchBar(){
		//this.searchBar=true;
		let modal = Modal.create(Search);
    this.nav.present(modal)
	}

}
