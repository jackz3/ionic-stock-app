import {Injectable} from '@angular/core';
import {Home} from '../pages/home/home';
import {About} from '../pages/about/about';
import {Detail} from '../pages/detail/detail';
import {StockService,CLOSE_INCREASE,CLOSE_DECLINE} from './stock';
import {LocalData} from './local-data';

@Injectable()
export class MenuService {
	static get parameters() {
    return [[LocalData],[StockService]];
  }
	constructor(localData,stockService){
		this._menu=[];
		this.curPage='';
		this.localData=localData;
		this.stockService=stockService;
	}
	getMenu(){
		return this._menu;
	}
	buildMenu(page){
		if(page!==this.curPage){
			this.curPage=page;
			let menu=[];
			if(page!=='favors'){
				menu.push({ title: '自选股', component: Home, icon: 'star',type:'favors'})
			}
			if(page==='detail'){
				let codes=this.localData.getFavors();
      	let stocks=this.stockService.getStocks(codes);
				let items=stocks.map(x=>({
					title: x.code.slice(2)+' '+x.name, component: Detail, icon: 'trending-up',code:x.code,name:'detail'
				}));
				Array.prototype.push.apply(menu,items);
			}
			if(page!==CLOSE_INCREASE){
				menu.push({ title: '涨幅榜', component: Home, index: 1, icon: 'trending-up',type:CLOSE_INCREASE });
			}
			if(page!==CLOSE_DECLINE){
				menu.push({ title: '跌幅榜', component: Home, index: 2, icon: 'trending-down',type:CLOSE_DECLINE });
			}
			if(page!=='about'){
				menu.push({ title: '关于', component: About, index: 3, icon: 'information-circle' });
			}
			this._menu.splice(0,this._menu.length,...menu);	
		}
	}
}