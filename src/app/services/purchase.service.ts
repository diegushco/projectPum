import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http:HttpClient, private router:Router) { }

  getAllPurchases(){
      return this.http.get(environment.apiUrl + '/purchases');
  }

  savePurchase(data){
    return this.http.post(environment.apiUrl + '/purchases', data);
  }

}

