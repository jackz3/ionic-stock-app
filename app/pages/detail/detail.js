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
    this.timer=0;
		
		this.stock={};
		this.updateFavorBtn();
		this.setStock();
		
		if(this.code==='sh000001' || this.code.slice(0,5)==='sz399'){
			this.showBuySell=false;
		}else{
			this.showBuySell=true;
		}
  }
	onPageWillEnter(){
		this.polling();
	}
	onPageWillLeave(){
	  this.clearTimer();
	}
	polling(){
		if(this.stockService.isOpening()){
			
			this.timer=setTimeout(this.polling.bind(this),8000);
		}else{
			this.clearTimer();
		}
	}
	pollingChart(){
		this.stockService.fetchMinutes(this.code).then(()=>{
			
		});
	}
	clearTimer(){
	  if(this.timer){
      clearTimeout(this.timer);
    }
	}
	initCanvas(){
		var canvas=React.findDOMNode(this.refs.canvas);
    var ctx = canvas.getContext("2d");
    ctx.canvas.width  = 640;//this.props.width;
    ctx.canvas.height = 480;//this.props.width*0.6;
    
    var wrapper=React.findDOMNode(this);
    var labels=wrapper.querySelectorAll('.chartLabel');
    this.props.setLabelStyle(labels[0],2,2,'red');
    //$labels.eq(1).css({top:priceHeight/2-20,left:2,color:'black'});
    this.props.setLabelStyle(labels[2],priceHeight-18,2,'green');
    this.props.setLabelStyle(labels[3],priceHeight+timeHeight+2,2,'black');
    
    this.bufCanvas = document.createElement('canvas');
    this.bufCanvas.width = 640;//this.minChart.width;
    this.bufCanvas.height = 480;//this.minChart.height;
	}
	updateFavorBtn(){
		let favors=this.localData.getFavors();
		this.isFavor=favors.includes(this.code);
	}
	setStock(){
		let data=this.stockService.getStocks([this.code]);
		let stock=data[0];
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
