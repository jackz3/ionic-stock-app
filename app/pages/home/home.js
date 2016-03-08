import {Page,NavController,NavParams,Modal} from 'ionic-framework/ionic';
import {LocalData} from '../../providers/local-data';
import {StockService} from '../../providers/stock';
import {PriceDiff} from '../../providers/price-diff';
import {Detail} from '../detail/detail';
import {Search} from '../search/search';

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
		
		if(this.type==='favors'){
			this.fetch();	
		}else{
			this.fetchRankings(this.type);
		}
    
  }
	isIncrease(stock){
		return stock.close>stock.last;
	}
	isDecline(stock){
		return stock.last>stock.close;
	}
	getDiff(stock){
		return stock.close-stock.last;
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
			let data=this.stockService.getData();
			if(data[sort]){
				this.stocks=data[sort].data.map(code=>data[code]);
			}
		});
	}
  fetch(stocks){
		let codes=this.localData.getFavors();
    this.stockService.fetchDay(codes).then(()=>{
			let data=this.stockService.getData();
			this.stocks=codes.map(code=>{
				return data[code]
			})
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

	OnDestroy(){
	  console.log('destroy!');
	}
}
