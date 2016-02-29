import {Injectable, Inject} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-framework/ionic';

@Injectable()
export class LacalData {
  constructor() {
    this._localData = {
			favors:['sh000001','sz399001']
		};
    this.storage = new Storage(LocalStorage);
  }

  read() {
		let data=this.storage.get('local');
		if(data){
			this._localData=JSON.parse(data);
		}
    return this._localData;
  }

  save(localData) {
    this.storage.set('local',localData);
  }

}