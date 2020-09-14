import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'flexi-loading',
  template: `<div class="slider">
              <div class="line"></div>
              <div class="subline inc"></div>
              <div class="subline dec"></div>
            </div>`
})
export class LoadingIndicatorComponent {
  constructor(){
  }
}

@Component({
  selector: 'flexi-loading-button',
  template: `<div class="loader"></div>`
})
export class loadingButtonComponent {
  constructor(){
  }
}
