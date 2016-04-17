import {Page,NavController,Alert,Modal} from 'ionic-angular';
import {LocalData} from '../../providers/local-data';
import {MenuService} from '../../providers/menu';
import {StockService} from '../../providers/stock';
import {Detail} from '../detail/detail';
import {Search} from '../search/search';

@Page({
  templateUrl: 'build/pages/modify/modify.html',
})
export class Modify {
  static get parameters() {
    return [[LocalData],[StockService],[MenuService],[NavController]];
  }
  constructor(localData,stockService,menuService,nav){
    this.localData=localData;
		this.stockService=stockService;
    this.menuService=menuService;
		this.nav=nav;
		this.loadFavors();
  }
	loadFavors(){
		let codes=this.localData.getFavors();
    this.stocks=this.stockService.getStocks(codes);
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
	onRemove(stock,evt){
		let confirm = Alert.create({
      	title: '确定从自选股移除？',
      	message: stock.name,
      	buttons: [
        {
          text: '取消'
        },
        {
          text: '确定',
          handler: () => {
            let promise=this.localData.removeFavor(stock.code);
						if(promise){
							promise.then(()=>this.loadFavors());
						}
          }
        }]
    	});
			this.nav.present(confirm);
			evt.stopPropagation();
	}
	showSearchBar(){
		let modal = Modal.create(Search);
    this.nav.present(modal)
	}
}
