import { Component, ViewChild, ElementRef, OnChanges, Input, ViewEncapsulation } from '@angular/core'
import {Config} from '../../providers/config'
import {StockService,isOpening} from '../../providers/stock'
// import { Subscription } from 'rxjs/Subscription'
// import { timer } from 'rxjs/observable/timer'
// import { Observable } from 'rxjs/Observable';
import {Subscription, timer, Observable, from} from 'rxjs'
import { switchMap, filter, retry } from 'rxjs/operators'
import * as d3 from 'd3-selection'
import * as d3Scale from "d3-scale"
import * as d3Array from "d3-array"
import * as d3Axis from "d3-axis"
import * as d3Shape from "d3-shape"
import * as d3TimeFomat from 'd3-time-format'

@Component({
  selector: 'stock-charts',
  template: '<div class="chart-wrapper" #stockChart></div>',
	styleUrls: ['./stockchart.scss'],
	encapsulation: ViewEncapsulation.ShadowDom
})
export class StockCharts implements OnChanges {
	@ViewChild('stockChart', {static: false}) chartRef: ElementRef
  @Input() private price: number
  @Input() private code: string
  @Input() private volume: number
  @Input() private last: number
	@Input() private chartType: string='minutes'
	curChart=''
  showLoading:boolean=false
	chartSubscription:Subscription
	chartWrapper: d3.Selection<any, {}, null, undefined>;
	width: number
	height: number
	volumeHeight:number
	priceHeight:number
	timeHeight:number=36
	volumeTop:number
	margin = {top: 8, right: 0, bottom: 4, left: 0}
	xScale:any
	yScale:any
  x: any;
  y: any;
  svg: any;
	g: any;
	priceLine: d3Shape.Line<[number, number]>
	avgLine:d3Shape.Line<[number,number]>
	viewWidth:number=1080
	viewHeight:number=500
	mData=[]
	kData=[]
	kPageSize:number
	priceScale:any
	pricePctScale: any
	volumeScale
	timeScale
	ma5Line: d3Shape.Line<[number, number]>
	ma10Line: d3Shape.Line<[number, number]>
	ma20Line: d3Shape.Line<[number, number]>
	mas = {
		ma5: {
			color:'grey',
			label: 'MA5'
		},
		ma10: {
			color:'black',
			label: 'MA10'
		},
		ma20: {
			color:'blue',
			label: 'MA20'
		}
	}
	wideScreen: boolean
	inited: boolean = false

  constructor(
		private config:Config,
		private stockService:StockService,
  ) { }

  ngAfterViewInit() {
    console.log('initing')
    this.setSvgSize()
		this.initSvg()
		this.updateChart()
  }

  ngOnChanges() {
		if (this.inited && this.chartType !== this.curChart) {
			this.updateChart()
		}
	}
	// ngAfterContentInit () {
	// 	this.updateChart()
	// }
	ngOnDestroy () {
		this.chartSubscription.unsubscribe()
	}
	updateChart(){
		if(this.chartType==='minutes'){
			this.initMinsAxis()
      this.subscript()
		}else if(this.chartType!=='minutes'){
			this.initCandleAxis()
      this.subscript()
		}
	}

	subscript(){
    if (this.chartSubscription) {
      this.chartSubscription.unsubscribe()
		}
		if(this.chartType==='minutes'){
			this.chartSubscription = timer(0, this.config.minsInterval)
				.pipe(filter(x=>this.chartType==='minutes' && x===0 || isOpening()),
					switchMap(x=>this.stockService
													.fetchMinutes(this.code)
													.then(()=>this.stockService.getMinutes(this.code))),
						retry()
				).subscribe((mData) => {
					this.mData=mData
					this.updateMinsChart()
				})
		}
		if(this.chartType==='days'){
			this.chartSubscription = from(this.stockService
																				.fetchKDays(this.code)
																				.then(()=>this.stockService.getKDays(this.code))
																		).pipe(retry())
																		.subscribe(data=>{
																				console.log('up candle')
																				this.kData=data.slice(-this.kPageSize)
																				this.updateCandleChart()
																			})
		}
		if(this.chartType==='weeks'){
			this.chartSubscription = from(this.stockService
																			.fetchKWeeks(this.code)
																			.then(()=>this.stockService.getKWeeks(this.code)))
																		.pipe(retry())
																		.subscribe(data=>{
																				this.kData=data.slice(-this.kPageSize)
																				this.updateCandleChart()
																			})
		}
		if(this.chartType==='months'){
			this.chartSubscription = from(this.stockService
																				.fetchKMonths(this.code)
																				.then(()=>this.stockService.getKMonths(this.code)))
																				.pipe(retry())
																								.subscribe(data=>{
																									this.kData=data.slice(-this.kPageSize)
																									this.updateCandleChart()
																								})
		}
	}
	setSvgSize () {
		this.wideScreen= this.config.vw >= 768
		if (this.wideScreen) {
			this.margin.left = 40
			this.margin.right = 40
			this.kPageSize = 100
		} else {
			this.margin.left = 0
			this.margin.right = 0
			this.kPageSize =60
		}
		this.width = 1080 - this.margin.left - this.margin.right
		this.height = 500 - this.margin.top - this.margin.bottom
		this.priceHeight=this.height*0.7
		this.volumeTop=this.priceHeight+this.timeHeight
		this.volumeHeight=this.height-this.volumeTop
	}
	initSvg(){
		function cursorState(mode) {
			d3.selectAll('.cursorline').style("display", mode)
			d3.selectAll('.active-tick.time-axis')
				.style('display', mode)
			d3.selectAll('.active-tick.price-axis')
				.style('display', mode)
			d3.selectAll('.active-tick.price-pct-axis')
				.style('display', mode)
			d3.selectAll('.active-tick.volume-tick')
				.style('display', mode)
		}
		const getCursor = this.getCursor.bind(this)
		this.chartWrapper=d3.select(this.chartRef.nativeElement)
												.on("mousemove", (a,b,selection)=>{
													const cx = d3.mouse(selection[0])[0]
													const cy = d3.mouse(selection[0])[1]
													const [x, y, idx] = getCursor(cx, cy)
													this.drawCursorLine(x, y)
													this.drawActiveTick(x, y, idx)
												})
												.on("mouseover", function () {
													cursorState('block')
												})
												.on("mouseout", function () {
													cursorState('none')
												})
												.on('keydown', function() {
													console.log('aaaa')
												})
		this.chartWrapper.append('div')
										.attr('class','candle-info')
		this.svg = this.chartWrapper.append("svg")
																.attr("width", '100%')
																.attr("height", '100%')
								.attr('viewBox','0 0 1080 500')
								console.log('w',this.width,this.height)
		const filter = this.svg
											.append('defs')
											.append('filter')
											.attr('x', '0')
											.attr('y', '0')
											.attr('width', '1')
											.attr('height', '1')
											.attr('id', `tick-bg_${this.code}`)
		filter.append('feFlood').attr('flood-color', '#333')
		filter.append('feComposite').attr('in', 'SourceGraphic')

		this.g = this.svg.append("g")
										.attr("transform", `translate(${this.margin.left},${this.margin.top})`)
		this.priceLine = d3Shape.line()
														.x( (d:any,idx) => this.timeScale(idx) )
														.y( (d:any) => this.priceScale(d.price) )
		this.avgLine=d3Shape.line()
												.x((d:any,idx)=>this.timeScale(idx))
												.y((d:any)=>this.priceScale(d.avg_price))
		this.ma5Line=d3Shape.line()
												.x((d:any)=>this.timeScale(d.date))
												.y((d:any)=>this.priceScale(d.ma5))
		this.ma10Line=d3Shape.line()
												.x((d:any)=>this.timeScale(d.date))
												.y((d:any)=>this.priceScale(d.ma10))
		this.ma20Line=d3Shape.line()
												.x((d:any)=>this.timeScale(d.date))
												.y((d:any)=>this.priceScale(d.ma20))
		this.inited = true
	}
	getCursor (cx, cy): any[] {
		const wrapper=this.chartRef.nativeElement
		const y = cy * (this.height + this.margin.top + this.margin.bottom) / wrapper.clientHeight - this.margin.top
		const x = cx * (this.width + this.margin.left + this.margin.right) / wrapper.clientWidth - this.margin.left
		let xPercent = x / this.width
		let idx = Math.round(xPercent * 241)
		const maxIdx = this.mData.length - 1
		if (idx > maxIdx) {
			idx = maxIdx
		}
		if (idx < 0) {
			idx = 0
		}
		xPercent = idx / 241

		return [xPercent * this.width, y, idx]
	}
	initMinsAxis() {
		this.g.html(null)
		this.initCursorLine()
		this.priceScale=d3Scale.scaleLinear()
													.range([this.priceHeight, 0])
		this.pricePctScale=d3Scale.scaleLinear()
														.range([this.priceHeight, 0])
		this.volumeScale=d3Scale.scaleLinear()
														.range([this.volumeHeight, 0])
														.nice()
		this.timeScale=d3Scale.scaleBand()
													.range([0, this.width])
													//.padding(0.1)

		this.g.append("g")
					.attr('class','price-axis')
					.attr("transform", `translate(0,0)`)
		this.g.append('g')
					.attr('class', 'price-pct-axis')
					.attr('transform', `translate(${this.width},0)`)
		this.g.append('g')
					.attr('class','time-axis')
					.attr("transform", `translate(0,${this.priceHeight})`)
		this.g.append("g")
					.attr('class','volume-axis')
					.attr('transform',`translate(0,${this.volumeTop})`)
		this.g.append("g")
					.attr('class','volume-right-axis')
					.attr('transform',`translate(${this.width}, ${this.volumeTop})`)
		this.g.append('g')
					.attr('class','volume-time-axis')
					.attr('transform',`translate(0,${this.height})`)

		this.g.append('path')
					.attr('class','mins-line price-line')
		this.g.append('path')
					.attr('class','avg-line price-line')
		this.g.append('line')
					.attr('class','v-line')
					.attr('x1',this.width/2)
					.attr('y1',0)
					.attr('x2',this.width/2)
					.attr('y2',this.priceHeight)
		this.g.append('line')
					.attr('class','h-line')
					.attr('x1',0)
					.attr('y1',this.priceHeight/2)
					.attr('x2',this.width)
					.attr('y2',this.priceHeight/2)
		this.g.append('text')
					.attr('class','tick time-axis')
					.attr('x',this.width/2)
					.attr('y',this.priceHeight+6)
					.attr('text-anchor','middle')
					.attr('alignment-baseline','hanging')
					.text('11:30 13:00')
		this.g.append('text')
					.attr('class','active-tick time-axis')
					.attr('y',this.priceHeight+20)
					.attr('text-anchor','middle')
		this.g.append('text')
					.attr('class','active-tick price-axis')
					.attr('x', 20 - this.margin.left)
					.attr('text-anchor','middle')
					.attr('alignment-baseline','central')
		this.g.append('text')
					.attr('class','active-tick price-pct-axis')
					.attr('x', this.width - 20 + this.margin.right)
					.attr('text-anchor','middle')
					.attr('alignment-baseline','central')
		this.g.append('text')
					.attr('class', 'active-tick volume-tick')
					.attr('x', 20 - this.margin.left)
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'central')
		this.curChart = this.chartType
	}
	initCursorLine(){
		this.g.append('line').attr('class','vline cursorline')
		this.g.append('line').attr('class','hline cursorline')
	}
	drawActiveTick(x, y, idx){
		if (!this.mData.length) {
			return
		}
		this.g.select('.active-tick.time-axis')
					.text(`\u00A0${this.mData[idx].time}\u00A0`)
					.attr('filter', `url(#tick-bg_${this.code})`)
					.attr('x', `${x}`)
		if (y >0 && y < this.priceHeight) {
			this.g.select('.active-tick.price-axis')
						.text(`\u00A0${this.priceScale.invert(y).toFixed(2)}\u00A0`)
						.attr('y', y)
						.attr('filter', `url(#tick-bg_${this.code})`)
			this.g.select('.active-tick.price-pct-axis')
						.text(`${this.pricePctScale.invert(y).toFixed(2)}%`)
						.attr('y', y)
						.attr('filter', `url(#tick-bg_${this.code})`)
			this.g.select('.active-tick.volume-tick').style('display', 'none')
		} else if (y > this.priceHeight + 36) {
			this.g.select('.active-tick.volume-tick')
						.text(`\u00A0${this.volumeScale.invert(y - this.priceHeight - 36).toFixed(0)}\u00A0`)
						.attr('y', y)
						.attr('filter', `url(#tick-bg_${this.code})`)
			this.g.select('.active-tick.price-axis').style('display', 'none')
			this.g.select('.active-tick.price-pct-axis').style('display', 'none')
		}
	}
	drawCursorLine(x, y) {
		this.g.select('.vline')
					.attr("x1", 0)
					.attr("y1", y)
					.attr("x2", this.width)
					.attr("y2", y)
					.style("display", "block")
		this.g.select('.hline')
					.attr('x1', x)
					.attr('y1', 0)
					.attr('x2', x)
					.attr('y2', this.height)
					.style('display','block')
	}
	updateMinsChart(){
		const last=this.last
		let priceRange:any[]=d3Array.extent(this.mData,(d)=>d.price)
		let maxPriceRange=Math.max(...priceRange.map(price=>Math.abs(price-last)))
		let maxPercentage=Math.ceil(maxPriceRange*100 /last)
		if(maxPercentage>10){
			maxPercentage=10
		}else{
			maxPriceRange=last*(maxPercentage/100)
		}
		priceRange=[last-maxPriceRange,last+maxPriceRange]
		const pctRange = [-maxPercentage, maxPercentage]
		this.priceScale.domain(priceRange)
		this.pricePctScale.domain(pctRange)
		this.timeScale.domain(Array(242).fill(0).map((x,i)=>i))//this.mData.map(d=>d.time))
		this.volumeScale.domain([0,d3Array.max(this.mData,d=>d.volume)])

		const priceAxis=this.g.select('.price-axis')
													.call(d3Axis[this.wideScreen ? 'axisLeft' : 'axisRight'](this.priceScale).tickValues(priceRange))
													.call(this.alignPriceLabel)
		const pricePctAxis = this.g.select('.price-pct-axis')
														.call(d3Axis[this.wideScreen ? 'axisRight' : 'axisLeft'](this.pricePctScale).tickValues(pctRange))
														.call(this.alignPriceLabel)
		// priceAxis.selectAll('line')
		// 				.attr('x2',6)
		// priceAxis.selectAll('text')
		// 				.attr("x", 24)
		this.g.select('.time-axis')
					.call(d3Axis.axisBottom(this.timeScale)
											.tickValues([0,241])
											.tickFormat(d=>{
												switch(d){
													case 0:
														return '9:30'
													case 241:
														return '15:00'
												}
											})
										)
					.call(this.alignTimeLabel.bind(this))
		this.g.select('.volume-time-axis')
					.call(d3Axis.axisBottom(this.timeScale).tickValues([]))
		this.g.select('.volume-right-axis')
					.call(d3Axis[this.wideScreen ? 'axisLeft' : 'axisRight'](this.volumeScale).tickValues([]))
		this.g.select('.volume-axis')
					.call(d3Axis[this.wideScreen ? 'axisLeft' : 'axisRight'](this.volumeScale).ticks(1))

		this.g.select('.price-line')
		//			.datum(StatsLineChart)
					.attr('d', this.priceLine(this.mData))
		this.g.select('.avg-line')
					.attr('d',this.avgLine(this.mData))

    const volumeBars=this.g.selectAll(".bar")
         									.data(this.mData.map((x, i, arr) => {
														const prePrice = i === 0 ? last : arr[i-1].price
														let color
														if(x.price > prePrice){
															color = 'red'
														}else if(x.price < prePrice){
															color = 'green'
														}else{
															color = 'black'
														}
														x.color = color
														return x
													 }))
		volumeBars.enter()
							.append("rect")
							.attr('class','bar')
							.merge(volumeBars)
							.attr('fill', (d)=> d.color)
         			.attr("x", (d,i) => this.timeScale(i) )
         			.attr("y", (d) => this.volumeTop+this.volumeScale(d.volume) )
         			.attr("width", this.timeScale.bandwidth())
							.attr("height", (d) =>this.volumeHeight-this.volumeScale(d.volume) )
		//volumeBars.exit().remove()
	}
	alignPriceLabel (selection){
		selection.selectAll('.tick text')
						.each((d,i,all)=>{
							switch(i){
								case 0:
									return d3.select(all[0])
													.attr('alignment-baseline','after-edge')
													.attr('dy', '0.1rem')
													.attr('fill', 'green')
								case 1:
									return d3.select(all[1])
													.attr('alignment-baseline','hanging')
													.attr('fill', 'red')
							}
						})
	}
	alignTimeLabel(selection){
		if (this.wideScreen) {
			return
		}
		selection.selectAll('.tick text')
						.each((d,i,all)=>{
							switch(d){
								case 0:
									return d3.select(all[i]).attr('text-anchor','start')
								case 241:
									d3.select(all[i]).attr('text-anchor','end')
							}
						})
	}
	initCandleAxis(){
		this.g.html(null)
		this.initCursorLine()
		this.priceScale=d3Scale.scaleLinear()
													.range([this.priceHeight, 0])
		this.volumeScale=d3Scale.scaleLinear()
														.range([this.volumeHeight, 0])
														.nice()
		this.timeScale=d3Scale.scaleBand()
													.range([0, this.width])
													.padding(0.3)

		this.g.append("g")
					.attr('class','price-axis')
		this.g.append('g')
					.attr('class','time-axis')
					.attr("transform", `translate(0,${this.priceHeight})`)
		this.g.append("g")
					.attr('class','volume-axis')
					.attr('transform',`translate(0,${this.volumeTop})`)
		this.g.append('g')
					.attr('class','volume-time-axis')
					.attr('transform',`translate(0,${this.height})`)

		this.g.append('path')
					.attr('class','ma5 ma-line')
		this.g.append('path')
					.attr('class','ma10 ma-line')
		this.g.append('path')
					.attr('class','ma20 ma-line')
		this.g.append('g')
					.attr('class','candle-info')
		Object.keys(this.mas).forEach((ma, i) => {
			this.g.append('text')
						.attr('class', 'ma-legend')
						.attr('x', 100 + i * 70)
						.attr('y', 10)
						.text(this.mas[ma].label)
						.style('fill', this.mas[ma].color)
		})
		this.curChart = this.chartType
	}
	updateCandleChart(){
		const {last} = this
		console.log(this.kData)
		const highest=d3Array.max(this.kData,d=>d.high)
		const lowest=d3Array.min(this.kData,d=>d.low)
		let priceRange=[lowest,highest]
		this.priceScale.domain(priceRange)
		const timeRange=this.kData.map(d=>d.date)
		this.timeScale.domain(timeRange)
		this.volumeScale.domain([0,d3Array.max(this.kData,d=>d.volume)])

		const priceAxis=this.g.select('.price-axis')
					.call(d3Axis[this.wideScreen ? 'axisLeft' : 'axisRight'](this.priceScale).tickValues(priceRange))
					.call(this.alignPriceLabel)
		const timeMod = 8
		const timeValues = timeRange.filter((x,i)=> i % timeMod === 0)
		this.g.select('.time-axis')
					.call(d3Axis.axisBottom(this.timeScale)
											.tickValues(timeValues)
											.tickFormat(d3TimeFomat.timeFormat("%y%m%d")))
		this.g.select('.volume-time-axis')
					.call(d3Axis.axisBottom(this.timeScale).tickValues([]))

		const volumeAxis=this.g.select('.volume-axis')
													.call(d3Axis.axisRight(this.volumeScale).ticks(2))

		const candleLines=this.g.selectAll('.candle-line')
														.data(this.kData)
		candleLines.enter()
							.append('line')
							.attr('class','candle-line')
							.merge(candleLines)
							.attr('x1',d=>this.timeScale(d.date)+this.timeScale.bandwidth()/2)
							.attr('y1',d=>this.priceScale(d.high))
							.attr('x2',d=>this.timeScale(d.date)+this.timeScale.bandwidth()/2)
							.attr('y2',d=>this.priceScale(d.low))
							.attr('stroke',d=>this.stockColor(d.open,d.close))
		candleLines.exit().remove()

		const candleBars=this.g.selectAll('.candle-bar')
													.data(this.kData)
		candleBars.enter()
							.append('rect')
							.attr('class','candle-bar')
							.merge(candleBars)
							.attr('x',d=>this.timeScale(d.date))
							.attr('y',d=>{
								if(d.close>d.open){
									return this.priceScale(d.close)
								}
								return this.priceScale(d.open)
							})
							.attr('width',d=>this.timeScale.bandwidth())
							.attr('height',d=>Math.abs(this.priceScale(d.open)-this.priceScale(d.close)))
							.attr('fill',d=>this.stockColor(d.open,d.close))
							.on('mouseover',function(d){
								// debugger
								const candleInfo=this.chartWrapper.select('.candle-info')
																			//.transition()
																			//.duration(200)
																			//.attr("transform", `translate(10,10)`)
																			.style({
																				left:10,
																				top:10
																			})
								// candleInfo.html('ccc'+d.open)
													// .append('text')
													// .text(d.open)
													// .text(d.close)
							}.bind(this))
		candleBars.exit().remove()

    const volumeBars=this.g.selectAll(".bar")
         									.data(this.kData)
		volumeBars.enter()
							.append("rect")
							.attr('class','bar')
							.merge(volumeBars)
         			.attr("x", (d) => this.timeScale(d.date))
         			.attr("y", (d) => this.volumeTop+this.volumeScale(d.volume) )
         			.attr("width", this.timeScale.bandwidth())
							.attr("height", (d) =>this.volumeHeight-this.volumeScale(d.volume) )
							.attr('fill',d=>this.stockColor(d.open,d.close))
		volumeBars.exit().remove()
		this.g.select('.ma5')
					.attr('d',this.ma5Line(this.kData))
					.attr('stroke', d => this.mas.ma5.color)
		this.g.select('.ma10')
					.attr('d',this.ma10Line(this.kData))
					.attr('stroke', d => this.mas.ma10.color)
		this.g.select('.ma20')
					.attr('d',this.ma20Line(this.kData))
					.attr('stroke', d => this.mas.ma20.color)
	}
	stockColor(open,close){
		if(close>open){
			return 'red'
		}
		return 'green'
	}
}
