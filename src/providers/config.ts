import { Injectable } from '@angular/core'
import {Platform} from 'ionic-angular';

@Injectable()
export class Config {
  readonly priceInterval: number = 5000
  readonly minsInterval: number = 30000
  vw: number
  constructor(private platform: Platform) {

	}
}
