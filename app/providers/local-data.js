import {Injectable, Inject} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-framework/ionic';

@Injectable()
export class LocalData {
  constructor() {
    this._favors=[];
    this.storage = new Storage(LocalStorage);
  }

  load() {
		this.storage.get('local').then(data=>{
		  if(data){
		    this._favors=data.favors;
		  }else{
		    this._favors=['sh000001','sz399001'];
		  }
	  });
  }

  getFavors(){
    return this._favors;
  }
  save(localData) {
    this.storage.set('local',localData);
  }

}