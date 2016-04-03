import {Page} from 'ionic-angular';
import {MenuService} from '../../providers/menu';

@Page({
  templateUrl: 'build/pages/about/about.html'
})
export class About {
	static get parameters() {
    return [[MenuService]];
  }
	constructor(menuService){
		this.menuService=menuService;
	}
	onPageWillEnter(){
		this.menuService.buildMenu('about');
	}
}