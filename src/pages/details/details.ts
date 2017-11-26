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
	{letter: "L", frequency: .04025},
	{letter: "M", frequency: .02406},
	{letter: "N", frequency: .06749},
	{letter: "O", frequency: .07507},
	{letter: "P", frequency: .01929},
	{letter: "Q", frequency: .00095},
	{letter: "R", frequency: .05987},
	{letter: "S", frequency: .06327},
	{letter: "T", frequency: .09056},
	{letter: "U", frequency: .02758},
	{letter: "V", frequency: .00978},
	{letter: "W", frequency: .02360},
	{letter: "X", frequency: .00150},
	{letter: "Y", frequency: .01974},
	{letter: "Z", frequency: .00074}
];
interface Stock {
	date: Date,
	value: number
}
const StatsLineChart: Stock[] = [
	{date: new Date("2010-01-01"), value: 210.73},
	{date: new Date("2010-01-04"), value: 214.01},
	{date: new Date("2010-01-05"), value: 214.38},
	{date: new Date("2010-01-06"), value: 210.97},
	{date: new Date("2010-01-07"), value: 210.58},
	{date: new Date("2010-01-08"), value: 211.98},
	{date: new Date("2010-01-11"), value: 210.11},
	{date: new Date("2010-01-12"), value: 207.72},
	{date: new Date("2010-01-13"), value: 210.65},
	{date: new Date("2010-01-14"), value: 209.43},
	{date: new Date("2010-01-15"), value: 205.93},
	{date: new Date("2010-01-18"), value: 205.93},
	{date: new Date("2010-01-19"), value: 215.04},
	{date: new Date("2010-01-20"), value: 211.72},
	{date: new Date("2010-01-21"), value: 208.07},
	{date: new Date("2010-01-22"), value: 197.75},
	{date: new Date("2010-01-25"), value: 203.08},
	{date: new Date("2010-01-26"), value: 205.94},
	{date: new Date("2010-01-27"), value: 207.88},
	{date: new Date("2010-01-28"), value: 199.29},
	{date: new Date("2010-01-29"), value: 192.06},
	{date: new Date("2010-02-01"), value: 194.73},
	{date: new Date("2010-02-02"), value: 195.86},
	{date: new Date("2010-02-03"), value: 199.23},
	{date: new Date("2010-02-04"), value: 192.05},
	{date: new Date("2010-02-05"), value: 195.46},
	{date: new Date("2010-02-08"), value: 194.12},
	{date: new Date("2010-02-09"), value: 196.19},
	{date: new Date("2010-02-10"), value: 195.12},
	{date: new Date("2010-02-11"), value: 198.67},
	{date: new Date("2010-02-12"), value: 200.38},
	{date: new Date("2010-02-15"), value: 200.38},
	{date: new Date("2010-02-16"), value: 203.40},
	{date: new Date("2010-02-17"), value: 202.55},
	{date: new Date("2010-02-18"), value: 202.93},
	{date: new Date("2010-02-19"), value: 201.67},
	{date: new Date("2010-02-22"), value: 200.42},
	{date: new Date("2010-02-23"), value: 197.06},
	{date: new Date("2010-02-24"), value: 200.66},
	{date: new Date("2010-02-25"), value: 202.00},
	{date: new Date("2010-02-26"), value: 204.62},
	{date: new Date("2010-03-01"), value: 208.99},
	{date: new Date("2010-03-02"), value: 208.85},
	{date: new Date("2010-03-03"), value: 209.33},
	{date: new Date("2010-03-04"), value: 210.71},
	{date: new Date("2010-03-05"), value: 218.95},
	{date: new Date("2010-03-08"), value: 219.08},
	{date: new Date("2010-03-09"), value: 223.02},
	{date: new Date("2010-03-10"), value: 224.84},
	{date: new Date("2010-03-11"), value: 225.50},
	{date: new Date("2010-03-12"), value: 226.60},
	{date: new Date("2010-03-15"), value: 223.84},
	{date: new Date("2010-03-16"), value: 224.45},
	{date: new Date("2010-03-17"), value: 224.12},
	{date: new Date("2010-03-18"), value: 224.65},
	{date: new Date("2010-03-19"), value: 222.25},
	{date: new Date("2010-03-22"), value: 224.75},
	{date: new Date("2010-03-23"), value: 228.36},
	{date: new Date("2010-03-24"), value: 229.37},
	{date: new Date("2010-03-25"), value: 226.65},
	{date: new Date("2010-03-26"), value: 230.90},
	{date: new Date("2010-03-29"), value: 232.39},
	{date: new Date("2010-03-30"), value: 235.84},
	{date: new Date("2010-03-31"), value: 235.00},
	{date: new Date("2010-04-01"), value: 235.97},
	{date: new Date("2010-04-02"), value: 235.97},
	{date: new Date("2010-04-05"), value: 238.49},
	{date: new Date("2010-04-06"), value: 239.54},
	{date: new Date("2010-04-07"), value: 240.60},
	{date: new Date("2010-04-08"), value: 239.95},
	{date: new Date("2010-04-09"), value: 241.79},
	{date: new Date("2010-04-12"), value: 242.29},
	{date: new Date("2010-04-13"), value: 242.43},
	{date: new Date("2010-04-14"), value: 245.69},
	{date: new Date("2010-04-15"), value: 248.92},
	{date: new Date("2010-04-16"), value: 247.40},
	{date: new Date("2010-04-19"), value: 247.07},
	{date: new Date("2010-04-20"), value: 244.59},
	{date: new Date("2010-04-21"), value: 259.22},
	{date: new Date("2010-04-22"), value: 266.47},
	{date: new Date("2010-04-23"), value: 270.83},
	{date: new Date("2010-04-26"), value: 269.50},
	{date: new Date("2010-04-27"), value: 262.04},
	{date: new Date("2010-04-28"), value: 261.60},
	{date: new Date("2010-04-29"), value: 268.64},
	{date: new Date("2010-04-30"), value: 261.09},
	{date: new Date("2010-05-03"), value: 266.35},
	{date: new Date("2010-05-04"), value: 258.68},
	{date: new Date("2010-05-05"), value: 255.98},
	{date: new Date("2010-05-06"), value: 246.25},
	{date: new Date("2010-05-07"), value: 235.86},
	{date: new Date("2010-05-10"), value: 253.99},
	{date: new Date("2010-05-11"), value: 256.52},
	{date: new Date("2010-05-12"), value: 262.09},
	{date: new Date("2010-05-13"), value: 258.36},
	{date: new Date("2010-05-14"), value: 253.82},
	{date: new Date("2010-05-17"), value: 254.22},
	{date: new Date("2010-05-18"), value: 252.36},
	{date: new Date("2010-05-19"), value: 248.34},
	{date: new Date("2010-05-20"), value: 237.76},
	{date: new Date("2010-05-21"), value: 242.32},
	{date: new Date("2010-05-24"), value: 246.76},
	{date: new Date("2010-05-25"), value: 245.22},
	{date: new Date("2010-05-26"), value: 244.11},
	{date: new Date("2010-05-27"), value: 253.35},
	{date: new Date("2010-05-28"), value: 256.88},
	{date: new Date("2010-05-31"), value: 256.88},
	{date: new Date("2010-06-01"), value: 260.83},
	{date: new Date("2010-06-02"), value: 263.95},
	{date: new Date("2010-06-03"), value: 263.12},
	{date: new Date("2010-06-04"), value: 255.96},
	{date: new Date("2010-06-07"), value: 250.94},
	{date: new Date("2010-06-08"), value: 249.33},
	{date: new Date("2010-06-09"), value: 243.20},
	{date: new Date("2010-06-10"), value: 250.51},
	{date: new Date("2010-06-11"), value: 253.51},
	{date: new Date("2010-06-14"), value: 254.28},
	{date: new Date("2010-06-15"), value: 259.69},
	{date: new Date("2010-06-16"), value: 267.25},
	{date: new Date("2010-06-17"), value: 271.87},
	{date: new Date("2010-06-18"), value: 274.07},
	{date: new Date("2010-06-21"), value: 270.17},
	{date: new Date("2010-06-22"), value: 273.85},
	{date: new Date("2010-06-23"), value: 270.97},
	{date: new Date("2010-06-24"), value: 269.00},
	{date: new Date("2010-06-25"), value: 266.70},
	{date: new Date("2010-06-28"), value: 268.30},
	{date: new Date("2010-06-29"), value: 256.17},
	{date: new Date("2010-06-30"), value: 251.53},
	{date: new Date("2010-07-01"), value: 248.48},
	{date: new Date("2010-07-02"), value: 246.94},
	{date: new Date("2010-07-05"), value: 246.94},
	{date: new Date("2010-07-06"), value: 248.63},
	{date: new Date("2010-07-07"), value: 258.66},
	{date: new Date("2010-07-08"), value: 258.09},
	{date: new Date("2010-07-09"), value: 259.62},
	{date: new Date("2010-07-12"), value: 257.28},
	{date: new Date("2010-07-13"), value: 251.80},
	{date: new Date("2010-07-14"), value: 252.73},
	{date: new Date("2010-07-15"), value: 251.45},
	{date: new Date("2010-07-16"), value: 249.90},
	{date: new Date("2010-07-19"), value: 245.58},
	{date: new Date("2010-07-20"), value: 251.89},
	{date: new Date("2010-07-21"), value: 254.24},
	{date: new Date("2010-07-22"), value: 259.02},
	{date: new Date("2010-07-23"), value: 259.94},
	{date: new Date("2010-07-26"), value: 259.28},
	{date: new Date("2010-07-27"), value: 264.08},
	{date: new Date("2010-07-28"), value: 260.96},
	{date: new Date("2010-07-29"), value: 258.11},
	{date: new Date("2010-07-30"), value: 257.25},
	{date: new Date("2010-08-02"), value: 261.85},
	{date: new Date("2010-08-03"), value: 261.93},
	{date: new Date("2010-08-04"), value: 262.98},
	{date: new Date("2010-08-05"), value: 261.70},
	{date: new Date("2010-08-06"), value: 260.09},
	{date: new Date("2010-08-09"), value: 261.75},
	{date: new Date("2010-08-10"), value: 259.41},
	{date: new Date("2010-08-11"), value: 250.19},
	{date: new Date("2010-08-12"), value: 251.79},
	{date: new Date("2010-08-13"), value: 249.10},
	{date: new Date("2010-08-16"), value: 247.64},
	{date: new Date("2010-08-17"), value: 251.97},
	{date: new Date("2010-08-18"), value: 253.07},
	{date: new Date("2010-08-19"), value: 249.88},
	{date: new Date("2010-08-20"), value: 249.64},
	{date: new Date("2010-08-23"), value: 245.80},
	{date: new Date("2010-08-24"), value: 239.93},
	{date: new Date("2010-08-25"), value: 242.89},
	{date: new Date("2010-08-26"), value: 240.28},
	{date: new Date("2010-08-27"), value: 241.62},
	{date: new Date("2010-08-30"), value: 242.50},
	{date: new Date("2010-08-31"), value: 243.10},
	{date: new Date("2010-09-01"), value: 250.33},
	{date: new Date("2010-09-02"), value: 252.17},
	{date: new Date("2010-09-03"), value: 258.77},
	{date: new Date("2010-09-06"), value: 258.77},
	{date: new Date("2010-09-07"), value: 257.81},
	{date: new Date("2010-09-08"), value: 262.92},
	{date: new Date("2010-09-09"), value: 263.07},
	{date: new Date("2010-09-10"), value: 263.41},
	{date: new Date("2010-09-13"), value: 267.04},
	{date: new Date("2010-09-14"), value: 268.06},
	{date: new Date("2010-09-15"), value: 270.22},
	{date: new Date("2010-09-16"), value: 276.57},
	{date: new Date("2010-09-17"), value: 275.37},
	{date: new Date("2010-09-20"), value: 283.23},
	{date: new Date("2010-09-21"), value: 283.77},
	{date: new Date("2010-09-22"), value: 287.75},
	{date: new Date("2010-09-23"), value: 288.92},
	{date: new Date("2010-09-24"), value: 292.32},
	{date: new Date("2010-09-27"), value: 291.16},
	{date: new Date("2010-09-28"), value: 286.86},
	{date: new Date("2010-09-29"), value: 287.37},
	{date: new Date("2010-09-30"), value: 283.75},
	{date: new Date("2010-10-01"), value: 282.52},
	{date: new Date("2010-10-04"), value: 278.64},
	{date: new Date("2010-10-05"), value: 288.94},
	{date: new Date("2010-10-06"), value: 289.19},
	{date: new Date("2010-10-07"), value: 289.22},
	{date: new Date("2010-10-08"), value: 294.07},
	{date: new Date("2010-10-11"), value: 295.36},
	{date: new Date("2010-10-12"), value: 298.54},
	{date: new Date("2010-10-13"), value: 300.14},
	{date: new Date("2010-10-14"), value: 302.31},
	{date: new Date("2010-10-15"), value: 314.74},
	{date: new Date("2010-10-18"), value: 318.00},
	{date: new Date("2010-10-19"), value: 309.49},
	{date: new Date("2010-10-20"), value: 310.53},
	{date: new Date("2010-10-21"), value: 309.52},
	{date: new Date("2010-10-22"), value: 307.47},
	{date: new Date("2010-10-25"), value: 308.84},
	{date: new Date("2010-10-26"), value: 308.05},
	{date: new Date("2010-10-27"), value: 307.83},
	{date: new Date("2010-10-28"), value: 305.24},
	{date: new Date("2010-10-29"), value: 300.98},
	{date: new Date("2010-11-01"), value: 304.18},
	{date: new Date("2010-11-02"), value: 309.36},
	{date: new Date("2010-11-03"), value: 312.80},
	{date: new Date("2010-11-04"), value: 318.27},
	{date: new Date("2010-11-05"), value: 317.13},
	{date: new Date("2010-11-08"), value: 318.62},
	{date: new Date("2010-11-09"), value: 316.08},
	{date: new Date("2010-11-10"), value: 318.03},
	{date: new Date("2010-11-11"), value: 316.66},
	{date: new Date("2010-11-12"), value: 308.03},
	{date: new Date("2010-11-15"), value: 307.04},
	{date: new Date("2010-11-16"), value: 301.59},
	{date: new Date("2010-11-17"), value: 300.50},
	{date: new Date("2010-11-18"), value: 308.43},
	{date: new Date("2010-11-19"), value: 306.73},
	{date: new Date("2010-11-22"), value: 313.36},
	{date: new Date("2010-11-23"), value: 308.73},
	{date: new Date("2010-11-24"), value: 314.80},
	{date: new Date("2010-11-26"), value: 315.00},
	{date: new Date("2010-11-29"), value: 316.87},
	{date: new Date("2010-11-30"), value: 311.15},
	{date: new Date("2010-12-01"), value: 316.40},
	{date: new Date("2010-12-02"), value: 318.15},
	{date: new Date("2010-12-03"), value: 317.44},
	{date: new Date("2010-12-06"), value: 320.15},
	{date: new Date("2010-12-07"), value: 318.21},
	{date: new Date("2010-12-08"), value: 321.01},
	{date: new Date("2010-12-09"), value: 319.76},
	{date: new Date("2010-12-10"), value: 320.56},
	{date: new Date("2010-12-13"), value: 321.67},
	{date: new Date("2010-12-14"), value: 320.29},
	{date: new Date("2010-12-15"), value: 320.36},
	{date: new Date("2010-12-16"), value: 321.25},
	{date: new Date("2010-12-17"), value: 320.61},
	{date: new Date("2010-12-20"), value: 322.21},
	{date: new Date("2010-12-21"), value: 324.20},
	{date: new Date("2010-12-22"), value: 325.16},
	{date: new Date("2010-12-23"), value: 323.60},
	{date: new Date("2010-12-27"), value: 324.68},
	{date: new Date("2010-12-28"), value: 325.47},
	{date: new Date("2010-12-29"), value: 325.29},
	{date: new Date("2010-12-30"), value: 323.66},
	{date: new Date("2010-12-31"), value: 322.56},
	{date: new Date("2011-01-03"), value: 329.57},
	{date: new Date("2011-01-04"), value: 331.29},
	{date: new Date("2011-01-05"), value: 334.00},
	{date: new Date("2011-01-06"), value: 333.73},
	{date: new Date("2011-01-07"), value: 336.12},
	{date: new Date("2011-01-10"), value: 342.46},
	{date: new Date("2011-01-11"), value: 341.64},
	{date: new Date("2011-01-12"), value: 344.42},
	{date: new Date("2011-01-13"), value: 345.68},
	{date: new Date("2011-01-14"), value: 348.48},
	{date: new Date("2011-01-18"), value: 340.65},
	{date: new Date("2011-01-19"), value: 338.84},
	{date: new Date("2011-01-20"), value: 332.68},
	{date: new Date("2011-01-21"), value: 326.72},
	{date: new Date("2011-01-24"), value: 337.45},
	{date: new Date("2011-01-25"), value: 341.40},
	{date: new Date("2011-01-26"), value: 343.85},
	{date: new Date("2011-01-27"), value: 343.21},
	{date: new Date("2011-01-28"), value: 336.10},
	{date: new Date("2011-01-31"), value: 339.32},
	{date: new Date("2011-02-01"), value: 345.03},
	{date: new Date("2011-02-02"), value: 344.32},
	{date: new Date("2011-02-03"), value: 343.44},
	{date: new Date("2011-02-04"), value: 346.50},
	{date: new Date("2011-02-07"), value: 351.88},
	{date: new Date("2011-02-08"), value: 355.20},
	{date: new Date("2011-02-09"), value: 358.16},
	{date: new Date("2011-02-10"), value: 354.54},
	{date: new Date("2011-02-11"), value: 356.85},
	{date: new Date("2011-02-14"), value: 359.18},
	{date: new Date("2011-02-15"), value: 359.90},
	{date: new Date("2011-02-16"), value: 363.13},
	{date: new Date("2011-02-17"), value: 358.30},
	{date: new Date("2011-02-18"), value: 350.56},
	{date: new Date("2011-02-22"), value: 338.61},
	{date: new Date("2011-02-23"), value: 342.62},
	{date: new Date("2011-02-24"), value: 342.88},
	{date: new Date("2011-02-25"), value: 348.16},
	{date: new Date("2011-02-28"), value: 353.21},
	{date: new Date("2011-03-01"), value: 349.31},
	{date: new Date("2011-03-02"), value: 352.12},
	{date: new Date("2011-03-03"), value: 359.56},
	{date: new Date("2011-03-04"), value: 360.00},
	{date: new Date("2011-03-07"), value: 355.36},
	{date: new Date("2011-03-08"), value: 355.76},
	{date: new Date("2011-03-09"), value: 352.47},
	{date: new Date("2011-03-10"), value: 346.67},
	{date: new Date("2011-03-11"), value: 351.99},
	{date: new Date("2011-03-14"), value: 353.56},
	{date: new Date("2011-03-15"), value: 345.43},
	{date: new Date("2011-03-16"), value: 330.01},
	{date: new Date("2011-03-17"), value: 334.64},
	{date: new Date("2011-03-18"), value: 330.67},
	{date: new Date("2011-03-21"), value: 339.30},
	{date: new Date("2011-03-22"), value: 341.20},
	{date: new Date("2011-03-23"), value: 339.19},
	{date: new Date("2011-03-24"), value: 344.97},
	{date: new Date("2011-03-25"), value: 351.54},
	{date: new Date("2011-03-28"), value: 350.44},
	{date: new Date("2011-03-29"), value: 350.96},
	{date: new Date("2011-03-30"), value: 348.63},
	{date: new Date("2011-03-31"), value: 348.51},
	{date: new Date("2011-04-01"), value: 344.56},
	{date: new Date("2011-04-04"), value: 341.19},
	{date: new Date("2011-04-05"), value: 338.89},
	{date: new Date("2011-04-06"), value: 338.04},
	{date: new Date("2011-04-07"), value: 338.08},
	{date: new Date("2011-04-08"), value: 335.06},
	{date: new Date("2011-04-11"), value: 330.80},
	{date: new Date("2011-04-12"), value: 332.40},
	{date: new Date("2011-04-13"), value: 336.13},
	{date: new Date("2011-04-14"), value: 332.42},
	{date: new Date("2011-04-15"), value: 327.46},
	{date: new Date("2011-04-18"), value: 331.85},
	{date: new Date("2011-04-19"), value: 337.86},
	{date: new Date("2011-04-20"), value: 342.41},
	{date: new Date("2011-04-21"), value: 350.70},
	{date: new Date("2011-04-25"), value: 353.01},
	{date: new Date("2011-04-26"), value: 350.42},
	{date: new Date("2011-04-27"), value: 350.15},
	{date: new Date("2011-04-28"), value: 346.75},
	{date: new Date("2011-04-29"), value: 350.13},
	{date: new Date("2011-05-02"), value: 346.28},
	{date: new Date("2011-05-03"), value: 348.20},
	{date: new Date("2011-05-04"), value: 349.57},
	{date: new Date("2011-05-05"), value: 346.75},
	{date: new Date("2011-05-06"), value: 346.66},
	{date: new Date("2011-05-09"), value: 347.60},
	{date: new Date("2011-05-10"), value: 349.45},
	{date: new Date("2011-05-11"), value: 347.23},
	{date: new Date("2011-05-12"), value: 346.57},
	{date: new Date("2011-05-13"), value: 340.50},
	{date: new Date("2011-05-16"), value: 333.30},
	{date: new Date("2011-05-17"), value: 336.14},
	{date: new Date("2011-05-18"), value: 339.87},
	{date: new Date("2011-05-19"), value: 340.53},
	{date: new Date("2011-05-20"), value: 335.22},
	{date: new Date("2011-05-23"), value: 334.40},
	{date: new Date("2011-05-24"), value: 332.19},
	{date: new Date("2011-05-25"), value: 336.78},
	{date: new Date("2011-05-26"), value: 335.00},
	{date: new Date("2011-05-27"), value: 337.41},
	{date: new Date("2011-05-31"), value: 347.83},
	{date: new Date("2011-06-01"), value: 345.51},
	{date: new Date("2011-06-02"), value: 346.10},
	{date: new Date("2011-06-03"), value: 343.44},
	{date: new Date("2011-06-06"), value: 338.04},
	{date: new Date("2011-06-07"), value: 332.04},
	{date: new Date("2011-06-08"), value: 332.24},
	{date: new Date("2011-06-09"), value: 331.49},
	{date: new Date("2011-06-10"), value: 325.90},
	{date: new Date("2011-06-13"), value: 326.60},
	{date: new Date("2011-06-14"), value: 332.44},
	{date: new Date("2011-06-15"), value: 326.75},
	{date: new Date("2011-06-16"), value: 325.16},
	{date: new Date("2011-06-17"), value: 320.26},
	{date: new Date("2011-06-20"), value: 315.32},
	{date: new Date("2011-06-21"), value: 325.30},
	{date: new Date("2011-06-22"), value: 322.61},
	{date: new Date("2011-06-23"), value: 331.23},
	{date: new Date("2011-06-24"), value: 326.35},
	{date: new Date("2011-06-27"), value: 332.04},
	{date: new Date("2011-06-28"), value: 335.26},
	{date: new Date("2011-06-29"), value: 334.04},
	{date: new Date("2011-06-30"), value: 335.67},
	{date: new Date("2011-07-01"), value: 343.26},
	{date: new Date("2011-07-05"), value: 349.43},
	{date: new Date("2011-07-06"), value: 351.76},
	{date: new Date("2011-07-07"), value: 357.20},
	{date: new Date("2011-07-08"), value: 359.71},
	{date: new Date("2011-07-11"), value: 354.00},
	{date: new Date("2011-07-12"), value: 353.75},
	{date: new Date("2011-07-13"), value: 358.02},
	{date: new Date("2011-07-14"), value: 357.77},
	{date: new Date("2011-07-15"), value: 364.92},
	{date: new Date("2011-07-18"), value: 373.80},
	{date: new Date("2011-07-19"), value: 376.85},
	{date: new Date("2011-07-20"), value: 386.90},
	{date: new Date("2011-07-21"), value: 387.29},
	{date: new Date("2011-07-22"), value: 393.30},
	{date: new Date("2011-07-25"), value: 398.50},
	{date: new Date("2011-07-26"), value: 403.41},
	{date: new Date("2011-07-27"), value: 392.59},
	{date: new Date("2011-07-28"), value: 391.82},
	{date: new Date("2011-07-29"), value: 390.48},
	{date: new Date("2011-08-01"), value: 396.75},
	{date: new Date("2011-08-02"), value: 388.91},
	{date: new Date("2011-08-03"), value: 392.57},
	{date: new Date("2011-08-04"), value: 377.37},
	{date: new Date("2011-08-05"), value: 373.62},
	{date: new Date("2011-08-08"), value: 353.21},
	{date: new Date("2011-08-09"), value: 374.01},
	{date: new Date("2011-08-10"), value: 363.69},
	{date: new Date("2011-08-11"), value: 373.70},
	{date: new Date("2011-08-12"), value: 376.99},
	{date: new Date("2011-08-15"), value: 383.41},
	{date: new Date("2011-08-16"), value: 380.48},
	{date: new Date("2011-08-17"), value: 380.44},
	{date: new Date("2011-08-18"), value: 366.05},
	{date: new Date("2011-08-19"), value: 356.03},
	{date: new Date("2011-08-22"), value: 356.44},
	{date: new Date("2011-08-23"), value: 373.60},
	{date: new Date("2011-08-24"), value: 376.18},
	{date: new Date("2011-08-25"), value: 373.72},
	{date: new Date("2011-08-26"), value: 383.58},
	{date: new Date("2011-08-29"), value: 389.97},
	{date: new Date("2011-08-30"), value: 389.99},
	{date: new Date("2011-08-31"), value: 384.83},
	{date: new Date("2011-09-01"), value: 381.03},
	{date: new Date("2011-09-02"), value: 374.05},
	{date: new Date("2011-09-06"), value: 379.74},
	{date: new Date("2011-09-07"), value: 383.93},
	{date: new Date("2011-09-08"), value: 384.14},
	{date: new Date("2011-09-09"), value: 377.48},
	{date: new Date("2011-09-12"), value: 379.94},
	{date: new Date("2011-09-13"), value: 384.62},
	{date: new Date("2011-09-14"), value: 389.30},
	{date: new Date("2011-09-15"), value: 392.96},
	{date: new Date("2011-09-16"), value: 400.50},
	{date: new Date("2011-09-19"), value: 411.63},
	{date: new Date("2011-09-20"), value: 413.45},
	{date: new Date("2011-09-21"), value: 412.14},
	{date: new Date("2011-09-22"), value: 401.82},
	{date: new Date("2011-09-23"), value: 404.30},
	{date: new Date("2011-09-26"), value: 403.17},
	{date: new Date("2011-09-27"), value: 399.26},
	{date: new Date("2011-09-28"), value: 397.01},
	{date: new Date("2011-09-29"), value: 390.57},
	{date: new Date("2011-09-30"), value: 381.32},
	{date: new Date("2011-10-03"), value: 374.60},
	{date: new Date("2011-10-04"), value: 372.50},
	{date: new Date("2011-10-05"), value: 378.25},
	{date: new Date("2011-10-06"), value: 377.37},
	{date: new Date("2011-10-07"), value: 369.80},
	{date: new Date("2011-10-10"), value: 388.81},
	{date: new Date("2011-10-11"), value: 400.29},
	{date: new Date("2011-10-12"), value: 402.19},
	{date: new Date("2011-10-13"), value: 408.43},
	{date: new Date("2011-10-14"), value: 422.00},
	{date: new Date("2011-10-17"), value: 419.99},
	{date: new Date("2011-10-18"), value: 422.24},
	{date: new Date("2011-10-19"), value: 398.62},
	{date: new Date("2011-10-20"), value: 395.31},
	{date: new Date("2011-10-21"), value: 392.87},
	{date: new Date("2011-10-24"), value: 405.77},
	{date: new Date("2011-10-25"), value: 397.77},
	{date: new Date("2011-10-26"), value: 400.60},
	{date: new Date("2011-10-27"), value: 404.69},
	{date: new Date("2011-10-28"), value: 404.95},
	{date: new Date("2011-10-31"), value: 404.78},
	{date: new Date("2011-11-01"), value: 396.51},
	{date: new Date("2011-11-02"), value: 397.41},
	{date: new Date("2011-11-03"), value: 403.07},
	{date: new Date("2011-11-04"), value: 400.24},
	{date: new Date("2011-11-07"), value: 399.73},
	{date: new Date("2011-11-08"), value: 406.23},
	{date: new Date("2011-11-09"), value: 395.28},
	{date: new Date("2011-11-10"), value: 385.22},
	{date: new Date("2011-11-11"), value: 384.62},
	{date: new Date("2011-11-14"), value: 379.26},
	{date: new Date("2011-11-15"), value: 388.83},
	{date: new Date("2011-11-16"), value: 384.77},
	{date: new Date("2011-11-17"), value: 377.41},
	{date: new Date("2011-11-18"), value: 374.94},
	{date: new Date("2011-11-21"), value: 369.01},
	{date: new Date("2011-11-22"), value: 376.51},
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
	initSvg(){
		this.svg = d3.select("#barChart")
								.append("svg")
								.attr("width", '100%')
								.attr("height", '100%')
								.attr('viewBox','0 0 1080 600');
		this.g = this.svg.append("g")
										.attr("transform", `translate(${this.margin.left},${this.margin.top})`)
	}
	initAxis() {
		this.xScale = d3Scale.scaleTime().range([0, this.width]);
    this.yScale = d3Scale.scaleLinear().range([this.lineHeight, 0]);
    this.xScale.domain(d3Array.extent(StatsLineChart, (d) => d.date ));
		this.yScale.domain(d3Array.extent(StatsLineChart, (d) => d.value ));
		
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.barHeight, 0]);
    this.x.domain(StatsBarChart.map((d) => d.letter))
    this.y.domain([0, d3Array.max(StatsBarChart, (d) => d.frequency)]);
	}
	drawAxis() {
		this.svg.append("g")
						.attr("transform", "translate(0," + this.lineHeight + ")")
						.call(d3Axis.axisBottom(this.xScale))
		this.svg.append("g")
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
											.x( (d:any) => this.x(d.date) )
											.y( (d:any) => this.y(d.value) )
		this.svg.append("path")
						.data(StatsLineChart)
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

  constructor(
		private localData:LocalData,
		private stockService:StockService,
    private navParams:NavParams,
    private nav:NavController,
    private modalCtrl: ModalController,
		private alertCtrl: AlertController,
		@ViewChild('stockChart') private	canvasRef: ElementRef
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
		this.barHeight=this.height*0.3
		this.lineHeight=this.height*0.6
  }
	ionViewDidLoad(){
		//setTimeout(this.initCanvas.bind(this),0)
		this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawBars();
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
														.switchMap(x=>this.stockService.fetchMinutes(this.code))
														.subscribe()
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
		let wrapper=this.canvasRef.nativeElement
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