import { Platform } from '@ionic/angular';
import { Router } from '@angular/router'
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component } from '@angular/core'
import {LocalData} from './providers/local-data'
import {StockService} from './providers/stock'
import {Config} from './providers/config'
import {HomePage} from './pages/home/home'
import {DetailsPage} from './pages/details/details'
import {WelcomePage} from './pages/welcome/welcome'
import { switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  // @ViewChild('', {static: false}) nav: Nav
  stocks: any[] = []
  root:any
	pages:any[] = [
    { title: '自选股', url: '/home', icon: 'star',type:'favors',name:'HomePage', index:0},
    { title: '涨跌榜', url: '/home', index: 1, icon: 'trending-up', params: {type:'boards'}, name:'BoardsPage' },
    { title: '关于', url: '/about', index: 2, icon: 'information-circle',name:'AboutPage' },
  ]
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localData:LocalData,
    private stockService:StockService,
    private config:Config,
    private router: Router,
  ) {
    this.localData
        .getFavors().pipe(
          switchMap(codes=>this.stockService
                              .fetchDay(codes)
                              .then(()=>this.stockService.getStocks(codes))
          )
        )
        .subscribe(stocks=>this.stocks=stocks.map(x=>({
              title: x.code.slice(2)+' '+x.name,
              component: DetailsPage,
              icon: 'stats',
              code:x.code,
              name:'DetailsPage'
        })))
    //this.localData.load()
    this.root=WelcomePage
    this.initializeApp()
    this.config.vw = platform.width()
    platform.resize.subscribe(()=> {
      this.config.vw = platform.width()
    })
  }
	gotoPage(page){
		if(page.name==='DetailsPage'){
      // return this.nav.push(page.component,{code:page.code})
      return this.router.navigate([])
    }
    this.router.navigate([page.url, page.params || {}])
  }
  isActive (url: string) {
    return this.router.url === url
  }
  getColor (page) {
    const url = `${page.url}${page.params? ';' + Object.keys(page.params).map(x => `${x}=${page.params[x]}`).join(';') : ''}`
    return this.router.url === url ? 'primary' : ''
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })
  }
}
