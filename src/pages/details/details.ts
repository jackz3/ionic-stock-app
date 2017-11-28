import { Component, Inject, forwardRef,ViewChild,ElementRef } from '@angular/core'
import {NavParams,NavController,AlertController,LoadingController,ModalController} from 'ionic-angular';
import {LocalData} from '../../providers/local-data';
import {StockService,isOpening} from '../../providers/stock';
import {SearchPage} from '../search/search';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';
import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3Shape from "d3-shape"
//import {StockCharts} from './charts';

interface Frequency {
	letter: string,
	frequency: number
}

const StatsBarChart: Frequency[] = [
	{letter: "A", frequency: .08167},
	{letter: "B", frequency: .01492},
	{letter: "C", frequency: .02782},
	{letter: "D", frequency: .04253},
	{letter: "E", frequency: .12702},
	{letter: "F", frequency: .02288},
	{letter: "G", frequency: .02015},
	{letter: "H", frequency: .06094},
	{letter: "I", frequency: .06966},
	{letter: "J", frequency: .00153},
	{letter: "K", frequency: .00772},
];
interface Stock {
	date: Date,
	value: number
}
const StatsLineChart: Stock[] = [
	{date: new Date("2011-11-23"), value: 366.99},
	{date: new Date("2011-11-25"), value: 363.57},
	{date: new Date("2011-11-28"), value: 376.12},
	{date: new Date("2011-11-29"), value: 373.20},
	{date: new Date("2011-11-30"), value: 382.20},
	{date: new Date("2011-12-01"), value: 387.93},
	{date: new Date("2011-12-02"), value: 389.70},
	{date: new Date("2011-12-05"), value: 393.01},
	{date: new Date("2011-12-06"), value: 390.95},
	{date: new Date("2011-12-07"), value: 389.09},
	{date: new Date("2011-12-08"), value: 390.66},
	{date: new Date("2011-12-09"), value: 393.62},
	{date: new Date("2011-12-12"), value: 391.84},
	{date: new Date("2011-12-13"), value: 388.81},
	{date: new Date("2011-12-14"), value: 380.19},
	{date: new Date("2011-12-15"), value: 378.94},
	{date: new Date("2011-12-16"), value: 381.02},
	{date: new Date("2011-12-19"), value: 382.21},
	{date: new Date("2011-12-20"), value: 395.95},
	{date: new Date("2011-12-21"), value: 396.44},
	{date: new Date("2011-12-22"), value: 398.55},
	{date: new Date("2011-12-23"), value: 403.43},
	{date: new Date("2011-12-27"), value: 406.53},
	{date: new Date("2011-12-28"), value: 402.64},
	{date: new Date("2011-12-29"), value: 405.12},
	{date: new Date("2011-12-30"), value: 405.00},
	{date: new Date("2012-01-03"), value: 411.23},
	{date: new Date("2012-01-04"), value: 413.44},
	{date: new Date("2012-01-05"), value: 418.03},
	{date: new Date("2012-01-06"), value: 422.40},
	{date: new Date("2012-01-09"), value: 421.73},
	{date: new Date("2012-01-10"), value: 423.24},
	{date: new Date("2012-01-11"), value: 422.55},
	{date: new Date("2012-01-12"), value: 421.39},
	{date: new Date("2012-01-13"), value: 419.81},
	{date: new Date("2012-01-17"), value: 424.70},
	{date: new Date("2012-01-18"), value: 429.11},
	{date: new Date("2012-01-19"), value: 427.75},
	{date: new Date("2012-01-20"), value: 420.30},
	{date: new Date("2012-01-23"), value: 427.41},
	{date: new Date("2012-01-24"), value: 420.41},
	{date: new Date("2012-01-25"), value: 446.66},
	{date: new Date("2012-01-26"), value: 444.63},
	{date: new Date("2012-01-27"), value: 447.28},
	{date: new Date("2012-01-30"), value: 453.01},
	{date: new Date("2012-01-31"), value: 456.48},
	{date: new Date("2012-02-01"), value: 456.19},
	{date: new Date("2012-02-02"), value: 455.12},
	{date: new Date("2012-02-03"), value: 459.68},
	{date: new Date("2012-02-06"), value: 463.97},
	{date: new Date("2012-02-07"), value: 468.83},
	{date: new Date("2012-02-08"), value: 476.68},
	{date: new Date("2012-02-09"), value: 493.17},
	{date: new Date("2012-02-10"), value: 493.42},
	{date: new Date("2012-02-13"), value: 502.60},
	{date: new Date("2012-02-14"), value: 509.46},
	{date: new Date("2012-02-15"), value: 497.67},
	{date: new Date("2012-02-16"), value: 502.21},
	{date: new Date("2012-02-17"), value: 502.12},
	{date: new Date("2012-02-21"), value: 514.85},
	{date: new Date("2012-02-22"), value: 513.04},
	{date: new Date("2012-02-23"), value: 516.39},
	{date: new Date("2012-02-24"), value: 522.41},
	{date: new Date("2012-02-27"), value: 525.76},
	{date: new Date("2012-02-28"), value: 535.41},
	{date: new Date("2012-02-29"), value: 542.44},
	{date: new Date("2012-03-01"), value: 544.47},
	{date: new Date("2012-03-02"), value: 545.18},
	{date: new Date("2012-03-05"), value: 533.16},
	{date: new Date("2012-03-06"), value: 530.26},
	{date: new Date("2012-03-07"), value: 530.69},
	{date: new Date("2012-03-08"), value: 541.99},
	{date: new Date("2012-03-09"), value: 545.17},
	{date: new Date("2012-03-12"), value: 552.00},
	{date: new Date("2012-03-13"), value: 568.10},
	{date: new Date("2012-03-14"), value: 589.58},
	{date: new Date("2012-03-15"), value: 585.56},
	{date: new Date("2012-03-16"), value: 585.57},
	{date: new Date("2012-03-19"), value: 601.10},
	{date: new Date("2012-03-20"), value: 605.96},
	{date: new Date("2012-03-21"), value: 602.50},
	{date: new Date("2012-03-22"), value: 599.34},
	{date: new Date("2012-03-23"), value: 596.05},
	{date: new Date("2012-03-26"), value: 606.98},
	{date: new Date("2012-03-27"), value: 614.48},
	{date: new Date("2012-03-28"), value: 617.62},
	{date: new Date("2012-03-29"), value: 609.86},
	{date: new Date("2012-03-30"), value: 599.55},
	{date: new Date("2012-04-02"), value: 618.63},
	{date: new Date("2012-04-03"), value: 629.32},
	{date: new Date("2012-04-04"), value: 624.31},
	{date: new Date("2012-04-05"), value: 633.68},
	{date: new Date("2012-04-09"), value: 636.23},
	{date: new Date("2012-04-10"), value: 628.44},
	{date: new Date("2012-04-11"), value: 626.20},
	{date: new Date("2012-04-12"), value: 622.77},
	{date: new Date("2012-04-13"), value: 605.23},
	{date: new Date("2012-04-16"), value: 580.13},
	{date: new Date("2012-04-17"), value: 609.70},
	{date: new Date("2012-04-18"), value: 608.34},
	{date: new Date("2012-04-19"), value: 587.44},
	{date: new Date("2012-04-20"), value: 572.98},
	{date: new Date("2012-04-23"), value: 571.70},
	{date: new Date("2012-04-24"), value: 560.28},
	{date: new Date("2012-04-25"), value: 610.00},
	{date: new Date("2012-04-26"), value: 607.70},
	{date: new Date("2012-04-27"), value: 603.00},
	{date: new Date("2012-04-30"), value: 583.98},
	{date: new Date("2012-05-01"), value: 582.13},
]

const PRICE_INTERVAL=5000
const MINS_INTERVAL=30000

@Component({
  templateUrl: 'details.html',
//	directives: [StockCharts]
})
export class DetailsPage {
	
	drawAxis() {
		this.g.append("g")
						.attr("transform", "translate(0," + this.lineHeight + ")")
						.call(d3Axis.axisBottom(this.xScale))
		this.g.append("g")
						.call(d3Axis.axisLeft(this.yScale))
		.append("text")
		.attr("class", "axis-title")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Price ($)");

    this.g.append("g")
        .attr("transform", `translate(0,${this.height})`)
        .call(d3Axis.axisBottom(this.x))
		this.g.append("g")
				.attr('transform',`translate(0,${this.height-this.barHeight})`)
        .call(d3Axis.axisLeft(this.y))
				// .append("text")
        // .attr("transform", "rotate(-90)")
        // .attr("y", 6)
        // .attr("dy", "0.71em")
        // .attr("text-anchor", "end")
        // .text("Frequency")
	}
	drawBars() {
		this.line = d3Shape.line()
											.x( (d:any) => this.xScale(d.date) )
											.y( (d:any) => this.yScale(d.value) )
		this.g.append("path")
					.datum(StatsLineChart)
		//.attr("class", "line")
					.attr("d", this.line);

    this.g.selectAll(".bar")
        .data(StatsBarChart)
        .enter().append("rect")
        .attr("x", (d) => this.x(d.letter) )
        .attr("y", (d) => this.height-this.barHeight+this.y(d.frequency) )
        .attr("width", this.x.bandwidth())
        .attr("height", (d) => this.barHeight - this.y(d.frequency) );
  }

  code:string
  chartTimer:number=null
  stock:any={}
  chartType:string='minutes'
  mChart:any={}
  showLoading:boolean=false
  showBuySell:boolean
  isFavor:boolean=false
  canvas:any
	bufCanvas:any
	favors:string[]=[]
	stockSubscription:Subscription
	minsSubscription:Subscription
	//@ViewChild('myMap') myMap
	width: number
	height: number
	barHeight:number
	lineHeight:number
	margin = {top: 20, right: 20, bottom: 30, left: 40}
	xScale:any
	yScale:any
  x: any;
  y: any;
  svg: any;
	g: any;
	line: d3Shape.Line<[number, number]>
	@ViewChild('stockChart') chartRef: ElementRef
	mData=[]
	priceScale:any
	volumeScale
	timeScale

  constructor(
		private localData:LocalData,
		private stockService:StockService,
    private navParams:NavParams,
    private nav:NavController,
    private modalCtrl: ModalController,
		private alertCtrl: AlertController
  ){
		this.code=navParams.get('code');
		// this.loading = Loading.create({
    // 	content: '载入中...'
  	// });
		if(this.code==='sh000001' || this.code.slice(0,5)==='sz399'){
			this.showBuySell=false;
		}else{
			this.showBuySell=true;
		}
		this.localData.getFavors()
						.subscribe(x=>{
							this.favors=x
							this.isFavor=x.includes(this.code)
						})

		this.width = 1080 - this.margin.left - this.margin.right
		this.height = 500 - this.margin.top - this.margin.bottom
		this.barHeight=this.height*0.2
		this.lineHeight=this.height*0.7
  }
	ionViewDidLoad(){
		//setTimeout(this.initCanvas.bind(this),0)
		this.initSvg()
    // this.initAxis();
    // this.drawAxis();
		// this.drawBars();
	}
	initSvg(){
		this.svg = d3.select(this.chartRef.nativeElement)
								.append("svg")
								.attr("width", '100%')
								.attr("height", '100%')
								.attr('viewBox','0 0 1080 500')
		this.g = this.svg.append("g")
										.attr("transform", `translate(${this.margin.left},${this.margin.top})`)
	}
	initAxis() {
		this.priceScale=d3Scale.scaleLinear()
													.domain([0,d3Array.max(this.mData,(d)=>d.price)])
		this.volumeScale=d3Scale.scaleLinear()
														.domain([0,d3Array.max(this.mData,d=>d.volume)])

		this.xScale = d3Scale.scaleTime().range([0, this.width]);
    this.yScale = d3Scale.scaleLinear().range([this.lineHeight, 0]);
    this.xScale.domain(d3Array.extent(StatsLineChart, (d) => d.date ));
		this.yScale.domain(d3Array.extent(StatsLineChart, (d) => d.value ));

    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.barHeight, 0]);
    this.x.domain(StatsBarChart.map((d) => d.letter))
    this.y.domain([0, d3Array.max(StatsBarChart, (d) => d.frequency)]);
	}

	ionViewWillEnter(){
		this.stockSubscription=timer(0,PRICE_INTERVAL).filter(x=>{
			if(x===0){
				return true
			}
			return isOpening()
		}).switchMap(x=>this.stockService
													.fetchDay([this.code])
													.then(()=>this.stockService.getStock(this.code))
		).subscribe(stock=>{
			this.stock=stock
		})
		//this.renderCharts(this.chartType);
		this.minsSubscription=timer(0,MINS_INTERVAL)
														.switchMap(x=>this.stockService
																							.fetchMinutes(this.code)
																							.then(()=>this.stockService.getMinutes(this.code)))
														.subscribe((mData)=>{
															this.mData=mData
														})
	}
	ionViewDidEnter(){
		console.log('enter')

		setTimeout(()=>{
			//this.initSvg()
			this.initAxis()
			this.drawAxis()
			this.drawBars()
		},500)
		//this.initAxis();
    //this.drawAxis();
    //this.drawBars();
	}
	ionViewWillLeave(){
		this.stockSubscription.unsubscribe()
		this.minsSubscription.unsubscribe()
	  //this.clearTimer();
		this.clearChartTimer()
	}
	pollingChart(force){
		if(this.stockService.isOpening()||force){
			this.stockService.fetchMinutes(this.code).then(()=>{
				if(force && this.showLoading){
					this.showLoading=false;
			//		this.loading.dismiss();
				}
				this.renderCharts(this.chartType);
			});
			let now=new Date();
			let interval=60-now.getSeconds()+1;
			if(interval<5){
				interval=5;
			}
			if(interval>30){
				interval=30;
			}
			this.chartTimer=setTimeout(this.pollingChart.bind(this),interval*1000);
		}
	}
	clearChartTimer(){
		if(this.chartTimer){
			clearTimeout(this.chartTimer);
			this.chartTimer=null;
		}
	}
	initCanvas(){
		let wrapper//=this.canvasRef.nativeElement
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
			if(!this.chartTimer){
				this.pollingChart(false);
			}
			let mins=this.stockService.getMinutes(this.code);
			if(mins){
				//setTimeout(this.renderMinutes.bind(this),0);
			}else{
				// if(!this.showLoading){
				// 	this.showLoading=true;
				// 	this.nav.present(this.loading);
				// }
				if(!this.chartTimer){
					this.pollingChart(true);
				}
			}
		// }else if(chartType==='days'){
		// 	this.clearChartTimer();
		// 		let days=this.stockService.getKDays(this.code);
		// 		if(days){
		// 			setTimeout(this.renderKChart.bind(this,days),0);
		// 		}else{
		// 			this.stockService.fetchKDays(this.code).then(()=>{
		// 				days=this.stockService.getKDays(this.code);
		// 				this.renderKChart(days);
		// 			});
		// 		}
		// }else if(chartType==='weeks'){
		// 	this.clearChartTimer();
		// 		let weeks=this.stockService.getKWeeks(this.code);
		// 		if(weeks){
		// 			setTimeout(this.renderKChart.bind(this,weeks),0);
		// 		}else{
		// 			this.stockService.fetchKWeeks(this.code).then(()=>{
		// 				weeks=this.stockService.getKWeeks(this.code);
		// 				this.renderKChart(weeks);
		// 			});
		// 		}
		// }else if(chartType==='months'){
		// 	this.clearChartTimer();
		// 		let months=this.stockService.getKMonths(this.code);
		// 		if(months){
		// 			setTimeout(this.renderKChart.bind(this,months),0);
		// 		}else{
		// 			this.stockService.fetchKMonths(this.code).then(()=>{
		// 				months=this.stockService.getKMonths(this.code);
		// 				this.renderKChart(months);
		// 			});
		// 		}
		}else{
			this.clearChartTimer();
			let kData=this.getKData(chartType);
			if(kData){
				setTimeout(this.renderKChart.bind(this,kData),0);
			}else{
				//debugger
				// if(!this.showLoading){
				// 	this.showLoading=true;
				// 	this.nav.present(this.loading);
				// }
				let promise;
				if(chartType==='days'){
					promise=this.stockService.fetchKDays(this.code);
				}else if(chartType==='weeks'){
					promise=this.stockService.fetchKWeeks(this.code);
				}else if(chartType==='months'){
					promise=this.stockService.fetchKMonths(this.code);
				}
				promise.then(()=>{
					//debugger;
					if(this.showLoading){
						this.showLoading=false;
					//	this.loading.dismiss();
					}
					kData=this.getKData(chartType);
					this.renderKChart(kData);
				});
			}
		}
	}
	getKData(chartType){
		if(chartType==='days'){
			return this.stockService.getKDays(this.code);
		}else if(chartType==='weeks'){
			return this.stockService.getKWeeks(this.code);
		}else if(chartType==='months'){
			return this.stockService.getKMonths(this.code);
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

		let lastIndex=kData.length-1;
		let time=this.stock.time;
		if(time.toDateString()===kData[lastIndex].date.toDateString()){
			if(this.getMinutesIndex(time)!==-1){
				kData[lastIndex].close=this.stock.close;
				kData[lastIndex].hight=this.stock.high;
				kData[lastIndex].low=this.stock.low;
				kData[lastIndex].volume=this.stock.volume;
				kData[lastIndex].amount=this.stock.amount;
			}
		}
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
		ctx.fillText(maxVol,padding,priceHeight+timeHeight+padding);
		ctx.textBaseline = "bottom";
    ctx.fillText(min.toFixed(2),padding,priceHeight-padding);

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
	kChartRange(arr,start,end,unknown){
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
	getMinutesIndex(time){
		let h=time.getHours();
		let m=time.getMinutes();
		if(h===9 && m>=30){
			return m-30;
		}
		if(h===10){
			return 30+m;
		}
		if(h===11 && m<=30){
			return 90+m;
		}
		if(h===11 && m>30){
			return 120;
		}
		if(h===12){
			return 120;
		}
		if(h>=13 && h<15){
			return 121+(h-13)*60+m;
		}
		return -1;
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
        bufCtx.fillText('9:30',0,priceHeight+3);
        bufCtx.textAlign = "center";
        bufCtx.fillText('11:30/13:00',width/2,priceHeight+3);
        bufCtx.textAlign='right';
        bufCtx.fillText('15:00',width,priceHeight+3);

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
			bufCtx.textAlign="left";
			bufCtx.fillText(maxVol,padding,priceHeight+timeHeight+padding);
			bufCtx.textBaseline = "bottom";
			bufCtx.fillText(last,padding,priceHeight/2-padding);
			bufCtx.fillStyle='#00cc00';
			bufCtx.fillText(min.toFixed(2),padding,priceHeight-padding);
			bufCtx.textAlign="right";
      bufCtx.fillText(maxPercent.toFixed(2)+'%',width-padding,priceHeight-padding);

			//var cntx=this.bufCanvas.getContext('2d');
      //cntx.clearRect(0,0,this.mChart.width,this.mChart.height);
			let index=this.getMinutesIndex(this.stock.time);
      this.drawPriceLine(bufCtx, minData, 'price', 'blue',index,this.stock.close);
      this.drawPriceLine(bufCtx, minData, 'avg_price', 'grey',index,this.stock.avg);
      this.drawVolumeLine(bufCtx, minData, this.stock.last,index,this.stock.volume);

			let ctx = this.canvas.getContext("2d");
			ctx.clearRect(0,0,width,canvasHeight);
      ctx.drawImage(this.bufCanvas,0,0);
		}
	}
	drawPriceLine(ctx,mdata,priceName,color,index,newPrice){
    var step=this.mChart.spacing,
        x=1+step/2,
        price=mdata[0][priceName],
        max=this.mChart.max,
        range=this.mChart.range,
        height=this.mChart.priceHeight-1;
		if(index!==-1 && index<mdata.length){
			mdata[index][priceName]=newPrice;
		}
    ctx.beginPath();
    ctx.moveTo(x,(max-price)/range*height+0.5);
		let length=mdata.length;
    for(var i=1;i<length;i++){
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
	drawVolumeLine(ctx,mdata,open,index,volume){
    var step=this.mChart.spacing,
        x=1+step/2,
        max=this.mChart.maxVolume,
        height=this.mChart.volumeHeight-1,
        canvasHeight=this.mChart.height,
        top=canvasHeight-height,
        lastPrice=open,price,vol,color='';
		if(index!==-1 && index<mdata.length){
			mdata[index].volume+=volume-mdata[0].totalVolume;
		}
		ctx.beginPath();
    ctx.strokeStyle='red';
		let length=mdata.length;
    for(var i=0;i<length;i++){
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
    for(i=0;i<length;i++){
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
	updateChart(){
		this.renderCharts(this.chartType)
	}
	showSearchBar(){
		const modal = this.modalCtrl.create(SearchPage,{nav:this.nav})
    modal.present()
	}
  addRemove(){
		if(this.isFavor){
			let confirm = this.alertCtrl.create({
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
            this.localData.removeFavor(this.code)
          }
        }
      	]
    	});
			confirm.present()
		}else{
			this.localData
					.addFavor(this.code)
					.then(()=>{
							const alert = this.alertCtrl.create({
      					title: '添加自选股成功!',
      					subTitle: this.stock.name,
      					buttons: ['确定']
    					})
    					alert.present()
					})
		}
	}

}