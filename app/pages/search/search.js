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
			let favors=this.localData.getFavors();
			this.results=results.map(x=>{
				if(favors.indexOf(x.code)>=0){
					x.added=true;
				}
				return x;
			});
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
		this.nav.push(Detail,{code:stock.code});
	}
	addToFavors(code,evt){
		this.localData.addFavor(code).then(()=>{
			let item=this.results.find(x=>x.code===code);
			if(item){
				item.added=true;
			}
		});
		evt.stopPropagation();
	}
}
