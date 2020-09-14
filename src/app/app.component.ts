import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet><ngx-ui-loader ></ngx-ui-loader></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private _loading: NgxUiLoaderService) {
    this.router.events.subscribe((evt) => {
      if(evt instanceof RouteConfigLoadStart){
        this._loading.start();
      }else if(evt instanceof RouteConfigLoadEnd){
        this._loading.stop();
      }else{
        this._loading.stop();
      }
    });
  }

  ngOnInit() {
    /*this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    */
  }
}
