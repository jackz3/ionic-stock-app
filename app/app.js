import {App, IonicApp } from 'ionic-framework/ionic';
import {LocalData} from './providers/local-data';
import {StockService} from './providers/stock';
import {HomePage} from './pages/home/home';

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
		this.root = HomePage;
		this.pages = [
      { title: '自选股', component: HomePage, icon: 'calendar' },
      { title: '涨幅榜', component: HomePage, index: 1, icon: 'contacts' },
      { title: '跌幅榜', component: HomePage, index: 2, icon: 'map' },
      { title: '关于', component: HomePage, index: 3, icon: 'information-circle' },
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
		if (page.index) {
      nav.setRoot(page.component, {tabIndex: page.index});
    } else {
      nav.setRoot(page.component);
    }
	}
}
