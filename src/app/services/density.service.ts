import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DensityService {

  constructor(private http:HttpClient, private router:Router) { }

  getAllDensity(){
      return this.http.get(environment.apiUrl + '/densities');
  }

}

