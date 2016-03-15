import {Page,NavController,NavParams,Modal} from 'ionic-framework/ionic';
import {LocalData} from '../../providers/local-data';
import {StockService} from '../../providers/stock';
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
    return [[LocalData],[StockService],[NavController],[NavParams]];
  }
  constructor(localData,stockService,nav,navParams){
    this.localData=localData;
    this.stockService=stockService;
		this.nav=nav;
		this.type=navParams.get('type')||'favors';
		this.timer=0;
		
		this.setStocks();
  }
	onPageWillEnter(){
		this.polling();
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
	  if(this.type==='favors'){
      let codes=this.localData.getFavors();
      this.stocks=this.stockService.getStocks(codes);
	  }else{
	    this.stocks=this.stockService.getStockRankings(this.type);
	  }
	}
	isIncrease(stock){
		return stock.close>stock.last;
	}
	isDecline(stock){
		return stock.last>stock.close;
	}
	getDiff(stock){
		return stock.last?stock.close-stock.last:'-';
	}
	getPercent(stock){
		if(stock.last===0 || stock.close===0){
			return '-'
		}
		let diff=this.getDiff(stock);
		return Math.abs(diff*100/stock.last).toFixed(2)+'%'
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
