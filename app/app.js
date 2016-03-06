import {App, IonicApp } from 'ionic-framework/ionic';
import {LocalData} from './providers/local-data';
import {StockService,CLOSE_INCREASE,CLOSE_DECLINE} from './providers/stock';
import {Home} from './pages/home/home';
import {About} from './pages/about/about';

@App({
  templateUrl: 'build/app.html',
	providers: [LocalData,StockService],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class Yunguba {
  static get parameters() {
    return [[IonicApp],[LocalData],[StockService]];
  }
  constructor(app,localData,stockService) {
		this.app = app;
    this.localData = localData;
    this.stockService = stockService;
    
		this.localData.load();
		this.root = Home;
		this.pages = [
      { title: '自选股', component: Home, icon: 'star',type:'favors'},
      { title: '涨幅榜', component: Home, index: 1, icon: 'trending-up',type:CLOSE_INCREASE },
      { title: '跌幅榜', component: Home, index: 2, icon: 'trending-down',type:CLOSE_DECLINE },
      { title: '关于', component: About, index: 3, icon: 'information-circle' },
    ];
    //platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    //});
  }
	gotoPage(page){
		let nav = this.app.getComponent('nav');
		if (page.index) {
      nav.setRoot(page.component, {tabIndex: page.index,type:page.type});
    } else {
      nav.setRoot(page.component);
    }
	}
}
