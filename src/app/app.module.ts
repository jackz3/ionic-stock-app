import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {StockService} from './providers/stock'
import { LocalData } from './providers/local-data'
// import { PriceDiff } from './providers/price-diff'
import {Config} from './providers/config';

@NgModule({
  declarations: [AppComponent],
  // entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StockService,
    LocalData,
    Config
  ],
  // exports: [PriceDiff],
  bootstrap: [AppComponent]
})
export class AppModule {}
