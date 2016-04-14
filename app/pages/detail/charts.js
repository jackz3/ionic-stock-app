import {Component,ElementRef} from 'angular2/core';

@Component({
	selector:'stock-charts',
	template:'<canvas></canvas>'
})
export class StockCharts{
	static get parameters() {
    return [[ElementRef]];
  }
	constructor(elemRef){
		this.elemRef=elemRef;
		this.mChart={};
	}
	ngAfterViewInit(){
		setTimeout(this.init.bind(this),0);
	}
	init(){
		debugger
		let wrapper=this.elemRef.nativeElement;
		let width=wrapper.clientWidth;
		console.log(width)
    //debugger;
		
    let canvasHeight=this.mChart.height=width*0.625,
				timeHeight=18,
        priceHeight=Math.floor(canvasHeight/5)*4-18-1,
        volumeHeight=canvasHeight-priceHeight-timeHeight;
		
		this.canvas=wrapper.firstElementChild;
    var ctx = this.canvas.getContext("2d");
    ctx.canvas.width  = width;
    ctx.canvas.height = canvasHeight;
    
		this.bufCanvas = document.createElement('canvas');
    this.bufCanvas.width = this.mChart.width;
    this.bufCanvas.height = this.mChart.height;
		
		this.mChart.width=width;
		this.mChart.priceHeight=priceHeight;
    this.mChart.timeHeight=timeHeight;
    this.mChart.volumeHeight=volumeHeight;
    this.mChart.spacing= (width-2)/242;
    
		// var labels=wrapper.querySelectorAll('.chartLabel');
    // this.setLabelStyle(labels[0],2,2,'red');
    // this.setLabelStyle(labels[1],priceHeight/2-18,2,'black');
    // this.setLabelStyle(labels[2],priceHeight-18,2,'green');
    // this.setLabelStyle(labels[3],priceHeight+timeHeight+2,2,'black');
    // this.setLabelStyle(labels[4],2,width-48,'red');
    // this.setLabelStyle(labels[5],priceHeight-18,width-48,'green');
    
	}
}