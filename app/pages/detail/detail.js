import {Page,NavParams,NavController,Alert,Modal} from 'ionic-angular';
import {LocalData} from '../../providers/local-data';
import {StockService} from '../../providers/stock';
import {Search} from '../search/search';

const PRICE_INTERVAL=6000;

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
		this.chartType='minutes';
		this.minChart={};
		
		if(this.code==='sh000001' || this.code.slice(0,5)==='sz399'){
			this.showBuySell=false;
		}else{
			this.showBuySell=true;
		}
		this.updateFavorBtn();
		
  }
	onPageLoaded(){
		//this.initCanvas();
		setTimeout(this.initCanvas.bind(this),0);
	}
	onPageWillEnter(){
		this.polling();
		this.pollingChart();
		
	}
	onPageWillLeave(){
	  this.clearTimer();
	}
	polling(){
		if(this.stockService.isOpening()){
			this.fetchStock();
			this.timer=setTimeout(this.polling.bind(this),PRICE_INTERVAL);
		}else{
			this.clearTimer();
			let stock=this.stockService.getStock(this.code);
			if(stock){
				this.stock=stock;
			}else{
				this.fetchStock();
			}
		}
	}
	pollingChart(){
		if(this.stockService.isOpening()){
			this.stockService.fetchMinutes(this.code).then(()=>{
					this.renderMinutes();
			});	
		}else{
			let mins=this.stockService.getMinutes(this.code);
			if(mins){
				this.renderMinutes();
			}else{
				this.stockService.fetchMinutes(this.code).then(()=>{
					this.renderMinutes();
				});	
			}
				
		}
	}
	clearTimer(){
	  if(this.timer){
      clearTimeout(this.timer);
    }
	}
	initCanvas(){
    let wrapper=document.querySelector('.canvas-wrapper');
		let width=wrapper.clientWidth;
		console.log(width)
    
		this.minChart.width=width;
    let canvasHeight=this.minChart.height=width*0.667,
        priceHeight=Math.floor(canvasHeight/5)*4-18-1,
        timeHeight=18,
        volumeHeight=canvasHeight-priceHeight-timeHeight;
		
    var canvas=document.getElementById('stock-chart');
    var ctx = canvas.getContext("2d");
    ctx.canvas.width  = width;
    ctx.canvas.height = canvasHeight;
    
		this.minChart.priceHeight=priceHeight;
    this.minChart.timeHeight=timeHeight;
    this.minChart.volumeHeight=volumeHeight;
    this.minChart.minStep= (width-2)/242;
    
		var labels=wrapper.querySelectorAll('.chartLabel');
    this.setLabelStyle(labels[0],2,2,'red');
    this.setLabelStyle(labels[1],priceHeight/2-18,2,'black');
    this.setLabelStyle(labels[2],priceHeight-18,2,'green');
    this.setLabelStyle(labels[3],priceHeight+timeHeight+2,2,'black');
    this.setLabelStyle(labels[4],2,width-48,'red');
    this.setLabelStyle(labels[5],priceHeight-18,width-48,'green');
		
    this.bufCanvas = document.createElement('canvas');
    this.bufCanvas.width = this.minChart.width;
    this.bufCanvas.height = this.minChart.height;
	}
	setLabelStyle(el,top,left,color){
    el.style.top=top+'px';
    el.style.left=left+'px';
    el.style.color=color;
  }
	renderMinutes(){
		var width=this.minChart.width,
        canvasHeight=this.minChart.height,
        priceHeight=this.minChart.priceHeight,
        timeHeight=this.minChart.timeHeight,
        volumeHeight=canvasHeight-priceHeight-timeHeight;
        
    var bufCtx=this.bufCanvas.getContext('2d');
        bufCtx.clearRect(0,0,width,canvasHeight);
        bufCtx.beginPath();
        bufCtx.lineWidth=1;
        bufCtx.strokeStyle='#000';
        bufCtx.strokeRect(0.5, 0.5, width-1, priceHeight-1);
        bufCtx.strokeRect(0.5,priceHeight+timeHeight+0.5,width-1, volumeHeight-1);
        
    var t=priceHeight/2;
        bufCtx.moveTo(1,t);
        bufCtx.lineTo(width-1,t);
        bufCtx.moveTo(width/2-0.5,1);
        bufCtx.lineTo(width/2-0.5,this.minChart.priceHeight-1);
        bufCtx.strokeStyle='#eee';
        bufCtx.stroke();
        bufCtx.fillStyle='#000';
        bufCtx.textBaseline = "top";
        bufCtx.textAlign="left";
        bufCtx.fillText('9:30',0,priceHeight+1);
        bufCtx.textAlign = "center";
        bufCtx.fillText('11:30/13:00',width/2,priceHeight+1);
        bufCtx.textAlign='right';
        bufCtx.fillText('15:00',width,priceHeight+1);
    
		var canvas=document.getElementById('stock-chart');
    var ctx = canvas.getContext("2d");
    ctx.drawImage(this.bufCanvas,0,0);
        
    var code=this.code,
        minData=this.stockService.getMinutes(code);
    if(this.stock && minData){
      let last=this.stock.last,
          t1=Math.abs(this.stock.high-last),
          t2=Math.abs(this.stock.low-last),
          margin=t1>t2?t1:t2;
          
          var percent= Math.ceil(margin*1000/last);
          margin=percent*last/1000;
          var max=Math.ceil((last+margin)*100)/100,
              min=last-max+last,
              maxPercent=(max/last-1)*100,
              range=max-min;
          this.minChart.max=max;
          this.minChart.range=range;
      
			var maxVol=Math.max.apply(null,minData.map(stock=>isNaN(stock.volume)?0:stock.volume));
      this.minChart.maxVolume=maxVol=Math.ceil(maxVol/1000)*1000;
          
			let labels=document.querySelectorAll('span.chartLabel');
			labels[0].innerHTML=max;
      labels[1].innerHTML=last;
      labels[2].innerHTML=min.toFixed(2);
      labels[3].innerHTML=maxVol;
      labels[4].innerHTML=maxPercent.toFixed(2)+'%';
      labels[5].innerHTML=maxPercent.toFixed(2)+'%';
          
      var cntx=this.bufCanvas.getContext('2d');
          cntx.clearRect(0,0,this.minChart.width,this.minChart.height);
          
      this.drawPriceLine(ctx, minData, 'price', 'blue');
      this.drawPriceLine(ctx, minData, 'avg_price', 'grey');
      this.drawVolumeLine(ctx, minData, this.stock.last);
      cntx.drawImage(this.bufCanvas,0,0);
		}
	}
	drawPriceLine(ctx,mdata,priceName,color){
    var step=this.minChart.minStep,
        x=1+step/2,
        price=mdata[0][priceName],
        max=this.minChart.max,
        range=this.minChart.range,
        height=this.minChart.priceHeight-1;
    ctx.beginPath();
    ctx.moveTo(x,(max-price)/range*height+0.5);
    for(var i=1;i<242;i++){
      price=mdata[i][priceName];
      if(price===-0.001){
        break;
      }
      x+=step;
      ctx.lineTo(x,(max-price)/range*height+0.5);
    }
    ctx.strokeStyle=color;
    ctx.stroke();
  }
	drawVolumeLine(ctx,mdata,open){
    var step=this.minChart.minStep,
        x=1+step/2,
        max=this.minChart.maxVolume,
        height=this.minChart.volumeHeight-1,
        canvasHeight=this.minChart.height,
        top=canvasHeight-height,
        lastPrice=open,price,vol,color='';
    console.log(height);
		console.log(canvasHeight)
    ctx.beginPath();
    ctx.strokeStyle='red';
    for(var i=0;i<242;i++){
      price=mdata[i].price;
      if(price===-0.001) break;
      if(price>=lastPrice){
        vol=mdata[i].volume;
        ctx.moveTo(x,(max-vol)/max*height+top+0.5);
        ctx.lineTo(x,canvasHeight-1);
      }
      x+=step;
      lastPrice=price;
    }
    ctx.stroke();
    
    lastPrice=open;
    x=1+step/2;
    ctx.beginPath();
    ctx.strokeStyle='green';
    for(i=0;i<242;i++){
      price=mdata[i].price;
      if(price===-0.001) break;
      if(price<lastPrice){
        vol=mdata[i].volume;
        ctx.moveTo(x,(max-vol)/max*height+top+0.5);
        ctx.lineTo(x,canvasHeight-1);
      }
      x+=step;
      lastPrice=price;
    }
    ctx.stroke();
  }
	updateFavorBtn(){
		let favors=this.localData.getFavors();
		this.isFavor=favors.includes(this.code);
	}
	fetchStock(){
    this.stockService.fetchDay([this.code]).then(()=>{
			this.stock=this.stockService.getStock(this.code);
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
