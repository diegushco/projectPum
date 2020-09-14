import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class cityService {

  constructor(private http:HttpClient, private router:Router) { }

  getCityByDeparment(id){
      return this.http.get(environment.apiUrl + '/departments/'+ id + '/cities');
  }

}

