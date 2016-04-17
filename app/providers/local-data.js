import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class LocalData {
  constructor() {
    this._favors=[];
    this.storage = new Storage(LocalStorage);
  }

  load() {
		this.storage.get('local').then(data=>{
		  if(data){
				let localData=JSON.parse(data);
		    this._favors=localData.favors;
		  }else{
		    this._favors=['sh000001','sz399001'];
		  }
	  });
  }

  getFavors(){
		return this._favors;
  }
	addFavor(code){
		if(!this._favors.includes(code)){
			this._favors.push(code);
			return this.save();
		}
	}
	removeFavor(code){
		let index=this._favors.indexOf(code);
		if(index){
			this._favors.splice(index,1);
			return this.save();
		}
	}
  save(){
		let localData={
			updatedDate:new Date(),
			favors:this._favors
		}
    return this.storage.set('local',JSON.stringify(localData));
  }

}