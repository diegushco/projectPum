import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  templateUrl: '404.component.html',
  styleUrls: ['404.component.css']
})
export class P404Component {

  constructor(private _location: Location) { }

  back(){
    this._location.back();
  }

}
