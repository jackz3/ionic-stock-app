import {Page,NavParams,NavController,Alert,Modal} from 'ionic-framework/ionic';
import {LocalData} from '../../providers/local-data';
import {StockService} from '../../providers/stock';
import {Search} from '../search/search';

@Page({
  templateUrl: 'build/pages/detail/detail.html'
})
export class Detail {
  static get parameters() {
    return [[LocalData],[StockService],[NavParams],[NavController]];
  }
  constructor(localData,stockService,navParams,nav){
    this.localData=localData;
    this.stockService=stockService;
		this.nav=nav;
		this.code=navParams.get('code');
    
		this.stock={};
		this.updateFavorBtn();
		this.setStock();
		
		if(this.code==='sh000001' || this.code.slice(0,5)==='sz399'){
			this.showBuySell=false;
		}else{
			this.showBuySell=true;
		}
  }
	updateFavorBtn(){
		let favors=this.localData.getFavors();
		this.isFavor=favors.includes(this.code);
	}
	setStock(){
		let data=this.stockService.getData();
		let stock=data[this.code];
		if(stock){
			this.stock=stock;			
		}else{
			this.fetch();
		}
		
	}
	fetch(){
		let codes=[this.code];
    this.stockService.fetchDay(codes).then(()=>{
			this.setStock();
		});
  }
	showSearchBar(){
		let modal = Modal.create(Search);
    this.nav.present(modal)
	}
  addRemove(){
		let favors=this.localData.getFavors();
		if(this.isFavor){
			let confirm = Alert.create({
      	title: '确定从自选股移除？',
      	message: this.stock.name,
      	buttons: [
        {
          text: '取消'
          // handler: () => { }
        },
        {
          text: '确定',
          handler: () => {
            let promise=this.localData.removeFavor(this.code);
						if(promise){
							promise.then(()=>{
								this.updateFavorBtn();
							});
						}
          }
        }
      	]
    	});
			this.nav.present(confirm);
		}else{
			let promise=this.localData.addFavor(this.code);
			if(promise){
				promise.then(()=>{
					let alert = Alert.create({
      		title: '添加自选股成功!',
      		subTitle: this.stock.name,
      		buttons: ['确定']
    			});
    			this.nav.present(alert);
					this.updateFavorBtn();
				})
			}
		
		}
	}
}
