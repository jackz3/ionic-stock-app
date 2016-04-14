import {ElementRef} from 'angular2/core';
import {Page,NavParams,NavController,Alert,Modal} from 'ionic-angular';
import {LocalData} from '../../providers/local-data';
import {StockService} from '../../providers/stock';
import {MenuService} from '../../providers/menu';
import {PriceDiff} from '../../providers/price-diff';
import {Search} from '../search/search';
//import {StockCharts} from './charts';

const PRICE_INTERVAL=6000;

@Page({
  templateUrl: 'build/pages/detail/detail.html',
	pipes: [PriceDiff],
//	directives: [StockCharts]
})
export class Detail {
  static get parameters() {
    return [[LocalData],[StockService],[MenuService],[NavParams],[NavController],[ElementRef]];
  }
	constructor(localData,stockService,menuService,navParams,nav,elemRef){
    this.localData=localData;
    this.stockService=stockService;
		this.menuService=menuService;
		this.nav=nav;
		this.code=navParams.get('code');
    this.timer=0;
		this.chartTimer=0;
		this.stock={};
		this.chartType='minutes';
		this.mChart={};
		this.elemRef=elemRef;
		
		if(this.code==='sh000001' || this.code.slice(0,5)==='sz399'){
			this.showBuySell=false;
		}else{
			this.showBuySell=true;
		}
		this.updateFavorBtn();
		
  }
	onPageLoaded(){
		setTimeout(this.initCanvas.bind(this),0);
	}
	onPageWillEnter(){
		this.polling();
		this.pollingChart(this.chartType);
		this.menuService.buildMenu('detail');
	}
	onPageDidEnter(){
		//debugger
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
			if(stock && stock.date){
				this.stock=stock;
			}else{
				this.fetchStock();
			}
		}
	}
	pollingChart(chartType){
		if(this.stockService.isOpening()){
			this.stockService.fetchMinutes(this.code).then(()=>{
					this.renderMinutes();
			});
		}else{
			this.renderCharts(chartType);			
		}
	}
	clearTimer(){
	  if(this.timer){
      clearTimeout(this.timer);
    }
	}
	initCanvas(){
		let wrapper=this.elemRef.nativeElement;
		let width=wrapper.clientWidth;
		console.log(width)
    
    let canvasHeight=this.mChart.height=width*0.625,
				timeHeight=18,
        priceHeight=Math.floor(canvasHeight/5)*4-18-1,
        volumeHeight=canvasHeight-priceHeight-timeHeight;
		
		this.canvas=wrapper.querySelector('canvas');
    let ctx = this.canvas.getContext("2d");
    ctx.canvas.width  = width;
    ctx.canvas.height = canvasHeight;
    
		this.bufCanvas = document.createElement('canvas');
    this.bufCanvas.width = width;
    this.bufCanvas.height = canvasHeight;
		
		this.mChart.width=width;
		this.mChart.priceHeight=priceHeight;
    this.mChart.timeHeight=timeHeight;
    this.mChart.volumeHeight=volumeHeight;
    this.mChart.spacing= (width-2)/242;
    
	}
	renderCharts(chartType){
		if(chartType==='minutes'){
				let mins=this.stockService.getMinutes(this.code);
				if(mins){
					setTimeout(this.renderMinutes.bind(this),0);
				}else{
					this.stockService.fetchMinutes(this.code).then(()=>{
						this.renderMinutes();
					});
				}
			}else if(chartType==='days'){
				let days=this.stockService.getKDays(this.code);
				if(days){
					setTimeout(this.renderKChart.bind(this,days),0);
				}else{
					this.stockService.fetchKDays(this.code).then(()=>{
						days=this.stockService.getKDays(this.code);
						this.renderKChart(days);
					});
				}
			}else if(chartType==='weeks'){
				let weeks=this.stockService.getKWeeks(this.code);
				if(weeks){
					setTimeout(this.renderKChart.bind(this,weeks),0);
				}else{
					this.stockService.fetchKWeeks(this.code).then(()=>{
						weeks=this.stockService.getKWeeks(this.code);
						this.renderKChart(weeks);
					});
				}
			}else if(chartType==='months'){
				let months=this.stockService.getKMonths(this.code);
				if(months){
					setTimeout(this.renderKChart.bind(this,months),0);
				}else{
					this.stockService.fetchKMonths(this.code).then(()=>{
						months=this.stockService.getKMonths(this.code);
						this.renderKChart(months);
					});
				}
			}
	}
	renderKChart(kData){
		var width=this.mChart.width,
       	canvasHeight=this.mChart.height,
        priceHeight=this.mChart.priceHeight,
        timeHeight=this.mChart.timeHeight,
        volumeHeight=canvasHeight-priceHeight-timeHeight;
        	
    var ctx=this.bufCanvas.getContext('2d');
    ctx.clearRect(0,0,width,canvasHeight);
    //ctx.beginPath();
    ctx.lineWidth=1;
    ctx.strokeStyle='#999';
    ctx.strokeRect(0.5, 0.5, width-1, priceHeight-1);
    ctx.strokeRect(0.5,priceHeight+timeHeight+0.5,width-1, volumeHeight-1);
        	
    var t=priceHeight/2;
    ctx.moveTo(1,t);
    ctx.lineTo(width-1,t);
    //ctx.moveTo(width/2-0.5,1);
    //ctx.lineTo(width/2-0.5,this.mChart.priceHeight-1);
    ctx.strokeStyle='#eee';
    ctx.stroke();
				
		var w=this.mChart.width,
				kNum=Math.floor((w-2)/((4+1)*2+1));
    if(kNum>kData.length){
    	kNum=kData.length;
    }
    var startIndex=kData.length-kNum,endIndex=kData.length-1;
    var kRange=this.kChartRange(kData, startIndex, endIndex, kNum);
    var margin=Math.round((kRange.max-kRange.min)*5)/100;
    var max=kRange.max+margin;
    var min=kRange.min-margin;
    var canvas =this.canvas;
    var cntx = canvas.getContext("2d");
    
    var maxVol=kRange.maxVol;
    maxVol=Math.ceil(maxVol/10000)*10000;
    
		const padding=3;
		ctx.fillStyle='#555';
    ctx.textBaseline = "top";
    ctx.textAlign="left";
    ctx.fillText(max.toFixed(2),padding,padding+1);
		ctx.textBaseline = "bottom";
    ctx.textAlign="left";
    ctx.fillText(min.toFixed(2),padding,priceHeight-padding);
		//$labels.eq(3).text(maxVol);
		
		const barWidth=5;
		var x=1+barWidth+0.5,
				rang=max-min,
        kHeight=this.mChart.priceHeight,
        vHeight=this.mChart.volumeHeight,
        canvasHeight=this.mChart.height,
        upper=canvasHeight-vHeight,
        range=max-min,k,color;
    ctx.beginPath();
    ctx.strokeStyle='green';
    ctx.lineWidth=1;
    for(var i=startIndex;i<=endIndex;i++){
      k=kData[i];
      if(k.open>k.close){
        ctx.moveTo(x,(max-k.high)/range*kHeight);
        ctx.lineTo(x,(max-k.low)/range*kHeight);
      }
      x+=barWidth*2+1;
    }
    ctx.stroke();
		//draw bar and volume
    ctx.beginPath();
    ctx.lineWidth=5;
    x=1+barWidth+0.5;
    for(var i=startIndex;i<=endIndex;i++){
      k=kData[i];
      if(k.open>k.close){
        ctx.moveTo(x,(max-k.open)/range*kHeight);
        ctx.lineTo(x,(max-k.close)/range*kHeight);
        ctx.moveTo(x,(maxVol-k.volume)/maxVol*vHeight+upper);
        ctx.lineTo(x,canvasHeight-1);
      }
      x+=barWidth*2+1;
    }
    ctx.stroke();
		x=1+barWidth+0.5;
    ctx.beginPath();
    ctx.strokeStyle='red';
    ctx.lineWidth=1;
    for(var i=startIndex;i<=endIndex;i++){
      k=kData[i];
      if(k.open<=k.close){
        ctx.moveTo(x,(max-k.high)/range*kHeight);
        ctx.lineTo(x,(max-k.low)/range*kHeight);
      }
      x+=barWidth*2+1;
    }
    ctx.stroke();
		ctx.beginPath();
    ctx.lineWidth=5;
    x=1+5+0.5;
    for(var i=startIndex;i<=endIndex;i++){
      k=kData[i];
      if(k.open<=k.close){
        ctx.moveTo(x,(max-k.open)/range*kHeight);
        ctx.lineTo(x,(max-k.close)/range*kHeight);
        ctx.moveTo(x,(maxVol-k.volume)/maxVol*vHeight+upper);
        ctx.lineTo(x,canvasHeight-1);
      }
      x+=barWidth*2+1;
    }
    ctx.stroke();
		this.drawMa(ctx, kData, 'ma5',startIndex,endIndex,max,range,kHeight,'blue');
    this.drawMa(ctx, kData, 'ma10',startIndex,endIndex,max,range,kHeight,'brown');
    this.drawMa(ctx, kData, 'ma20',startIndex,endIndex,max,range,kHeight,'grey');
		cntx.clearRect(0,0,this.mChart.width,this.mChart.height);
    cntx.drawImage(this.bufCanvas,0,0);
	}
	kChartRange(arr,start,end){
    var max=0,min=arr[start].low,maxVol=0,kdata;
    for(var i=start;i<=end;i++){
      kdata=arr[i];
      max=Math.max(kdata.high,max,kdata.ma5,kdata.ma10,kdata.ma20);
      min=Math.min(kdata.low,min,kdata.ma5,kdata.ma10,kdata.ma20);
      maxVol=Math.max(kdata.volume,maxVol);
    }
    return {max:max,min:min,maxVol:maxVol};
  }
	drawMa(ctx,kData,prop,start,end,max,range,kHeight,color){
    var x=1+5+0.5;
    ctx.beginPath();
    ctx.moveTo(x,(max-kData[start][prop])/range*kHeight);
    for(var i=start+1;i<=end;i++){
                x+=10+1;
                ctx.lineTo(x,(max-kData[i][prop])/range*kHeight);
    }
    ctx.strokeStyle=color;
    ctx.lineWidth=1;
    ctx.stroke();
  }
	renderMinutes(){
		var width=this.mChart.width,
        canvasHeight=this.mChart.height,
        priceHeight=this.mChart.priceHeight,
        timeHeight=this.mChart.timeHeight,
        volumeHeight=canvasHeight-priceHeight-timeHeight;
        
    var bufCtx=this.bufCanvas.getContext('2d');
        bufCtx.clearRect(0,0,width,canvasHeight);
        bufCtx.beginPath();
        bufCtx.lineWidth=1;
        bufCtx.strokeStyle='#999';
        bufCtx.strokeRect(0.5, 0.5, width-1, priceHeight-1);
        bufCtx.strokeRect(0.5,priceHeight+timeHeight+0.5,width-1, volumeHeight-1);
        
    var t=priceHeight/2;
        bufCtx.moveTo(1,t);
        bufCtx.lineTo(width-1,t);
        bufCtx.moveTo(width/2-0.5,1);
        bufCtx.lineTo(width/2-0.5,priceHeight-1);
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
      this.mChart.max=max;
      this.mChart.range=range;
      
			var maxVol=Math.max.apply(null,minData.map(stock=>isNaN(stock.volume)?0:stock.volume));
      this.mChart.maxVolume=maxVol=Math.ceil(maxVol/1000)*1000;
      
			const padding=3;
			bufCtx.fillStyle='#ff0033';
      bufCtx.textBaseline = "top";
      bufCtx.textAlign="left";
      bufCtx.fillText(max,padding,padding+1);
			bufCtx.textAlign="right";
			bufCtx.fillText(maxPercent.toFixed(2)+'%',width-padding,padding+1);
			bufCtx.fillStyle='#000';
			bufCtx.textBaseline = "bottom";
      bufCtx.textAlign="left";
			bufCtx.fillText(last,padding,priceHeight/2-padding);
			bufCtx.fillStyle='#00cc00';
			bufCtx.textBaseline = "bottom";
      bufCtx.textAlign="left";
      bufCtx.fillText(min.toFixed(2),padding,priceHeight-padding);
			bufCtx.textAlign="right";
      bufCtx.fillText(maxPercent.toFixed(2)+'%',width-padding,priceHeight-padding);
			
			//var cntx=this.bufCanvas.getContext('2d');
      //cntx.clearRect(0,0,this.mChart.width,this.mChart.height);
      this.drawPriceLine(bufCtx, minData, 'price', 'blue');
      this.drawPriceLine(bufCtx, minData, 'avg_price', 'grey');
      this.drawVolumeLine(bufCtx, minData, this.stock.last);
			
			let ctx = this.canvas.getContext("2d");
			ctx.clearRect(0,0,width,canvasHeight);
      ctx.drawImage(this.bufCanvas,0,0);
		}
	}
	drawPriceLine(ctx,mdata,priceName,color){
    var step=this.mChart.spacing,
        x=1+step/2,
        price=mdata[0][priceName],
        max=this.mChart.max,
        range=this.mChart.range,
        height=this.mChart.priceHeight-1;
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
    var step=this.mChart.spacing,
        x=1+step/2,
        max=this.mChart.maxVolume,
        height=this.mChart.volumeHeight-1,
        canvasHeight=this.mChart.height,
        top=canvasHeight-height,
        lastPrice=open,price,vol,color='';
    
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
	updateChart(){
		this.renderCharts(this.chartType);
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
