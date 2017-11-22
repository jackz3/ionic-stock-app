import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class LocalData {
	_favors:string[]=[]
	bsFavors:BehaviorSubject<string[]>=new BehaviorSubject(this._favors)

  constructor(private storage:Storage) {
		this.load()
	}

  load() {
		this.storage.get('local').then(data=>{
		  if(data){
				let localData=JSON.parse(data)
		    this._favors=localData.favors
		  }else{
				this._favors=['sh000001','sz399001']
			}
			this.bsFavors.next(this._favors)
	  })
  }
	getFavorsSnap(){
		return this._favors
	}
  getFavors():Observable<string[]>{
		return this.bsFavors.asObservable()
  }
	addFavor(code:string){
		if(!this._favors.includes(code)){
			this._favors.push(code)
			return this.save(this._favors)
		}
		return Promise.reject('existed')
	}
	removeFavor(code){
		const index=this._favors.indexOf(code)
		if(index>=0){
			this._favors.splice(index,1)
			return this.save(this._favors)
							.then(()=>index)
		}
		return Promise.reject(index)
	}
  save(codes){
		this.bsFavors.next(codes)
		const localData={
			updatedDate:new Date(),
			favors:codes
		}
		return this.storage.set('local',JSON.stringify(localData))
  }
}
