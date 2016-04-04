import {Page,NavController,ViewController} from 'ionic-angular';
import {LocalData} from '../../providers/local-data';
import {StockService} from '../../providers/stock';
import {Detail} from '../detail/detail';

@Page({
	templateUrl:'build/pages/search/search.html'
})
export class Search {
  static get parameters() {
    return [[LocalData],[StockService],[NavController],[ViewController]];
  }
  constructor(localData,stockService,nav,viewCtrl){
    this.localData=localData;
    this.stockService=stockService;
		this.nav=nav;
		this.viewCtrl=viewCtrl;
		this.q='';
		this.results=[];
  }
	find(searchBar){
		let q=searchBar.value.trim();
		if(!q) 	return;
		this.stockService.findStocks(searchBar.value).then(results=>{
			this.results=results;
		});
	}
	close(){
		this.viewCtrl.dismiss();
	}
	clear(e){
		this.q='';
	}
	gotoDetail(stock){
		//this.close();
		this.nav.push(Detail,{code:stock.city+stock.codeS});
	}
}
