import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component,ViewChild } from '@angular/core'
import {LocalData} from './providers/local-data'
import {StockService} from './providers/stock'
import {Config} from './providers/config'
import {HomePage} from './pages/home/home'
import {AboutPage} from './pages/about/about'
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
  stocks:string[]=[]
  root:any
	pages:any[]=[
    { title: '自选股', component: HomePage, icon: 'star',type:'favors',name:'HomePage',index:0},
    { title: '涨跌榜', component: HomePage, index: 1, icon: 'trending-up',type:'boards',name:'BoardsPage' },
    { title: '关于', component: AboutPage, index: 2, icon: 'information-circle',name:'AboutPage' },
  ]
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localData:LocalData,
    private stockService:StockService,
    private config:Config
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
	// gotoPage(page){
	// 	if(page.name==='DetailsPage'){
	// 		return this.nav.push(page.component,{code:page.code})
	// 	}
  //   this.nav.setRoot(page.component, {tabIndex: page.index,type:page.type})
  // }
  // isActive(page:any) {
  //   const active=this.nav.getActive()
  //   if (active){
  //     if(active.name==='HomePage'){
  //       if(active.data.type==='boards'){
  //         if(page.name==='BoardsPage'){
  //           return 'primary'
  //         }
  //       }else if(page.name==='HomePage'){
  //         return 'primary'
  //       }
  //     }else if(active.name===page.name) {
  //       return 'primary'
  //     }
  //   }
  // }
  // isDetailsActive(page:any){
  //   const active=this.nav.getActive()
  //   if(active.name===page.name && active.data.code===page.code){
  //     return 'pin'
  //   }
  // }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })
  }
}
