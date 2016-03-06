import {Page,NavController,Modal} from 'ionic-framework/ionic';
import {LocalData} from '../../providers/local-data';
import {StockService} from '../../providers/stock';
import {Detail} from '../detail/detail';
import {Search} from '../search/search';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class Home {
  static get parameters() {
    return [[LocalData],[StockService],[NavController]];
  }
  constructor(localData,stockService,nav){
    this.localData=localData;
    this.stockService=stockService;
		this.nav=nav;
    this.searchBar=false;
    this.fetch();
  }
	setStocks(){
		
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
	onCancelSearch(e){
		this.searchBar=false;
	}
	
}
