import { SharedModule } from './shared.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './containers';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

// Import routing module
import { AppRoutingModule } from './app.routing';

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CanActivateFlexiEspumasAuthGuard } from './app.guard';
import { P404Component } from './views/error/404.component';


 
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';

import es from '@angular/common/locales/es';

registerLocaleData(es);

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#FFF",
  "bgsOpacity": 0.5,
  "bgsPosition": "bottom-right",
  "bgsSize": 60,
  "bgsType": "square-jelly-box",
  "blur": 2,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "rgba(200, 200, 200, 0.46)",
  "fgsPosition": "center-center",
  "fgsSize": 90,
  "fgsType": "square-jelly-box",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 45,
  "logoUrl": "assets/img/brand/sygnet.svg",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(255,255,255,0.8)",
  "pbColor": "red",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": false,
  "text": "Cargando...",
  "textColor": "#2d527d",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 500
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,   
    HttpClientModule,
    BrowserAnimationsModule,
    AppAsideModule,
    AppBreadcrumbModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  declarations: [
    AppComponent, DefaultLayoutComponent, P404Component
  ],
  providers: [
    CanActivateFlexiEspumasAuthGuard,
    { provide: LocationStrategy,
    useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'es-*' }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
