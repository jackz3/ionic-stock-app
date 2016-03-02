import {Page} from 'ionic-framework/ionic';
import {LocalData} from '../../providers/local-data';
import {StockService} from '../../providers/stock';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  static get parameters() {
    return [[LocalData],[StockService]];
  }
  constructor(localData,stockService){
    this.localData=localData;
    this.stockService=stockService;
    this.favors=this.localData.getFavors();
    //this.stocks=[{name:'ddd'},{name:'fff'}]
    this.fetch();
  }
  fetch(){
    
    
  }
  gotoDetail(stock){
    console.log(stock);
  }
}
