import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'

@Component({
  template: ''
})
export class WelcomePage {
	constructor(nav:NavController){
    // nav.push()
    nav.setRoot('HomePage',{type:'favors'})
	}
}
