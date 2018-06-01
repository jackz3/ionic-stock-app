import { Injectable } from '@angular/core'
import {Platform} from 'ionic-angular';

@Injectable()
export class Config {
  readonly priceInterval: number = 5000
  readonly minsInterval: number = 30000
  vw: number
  public resizeCB
  constructor(platform: Platform) {
	}
  afterResize () {
    this.resizeCB && this.resizeCB()
  }
}
