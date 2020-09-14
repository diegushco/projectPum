import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeProductService {

  constructor(private http:HttpClient, private router:Router) { }

  getAllTypeProducts(){
      return this.http.get(environment.apiUrl +'/typeproducts');
  }

  getProductsNameByType(typeId){
    return this.http.get(environment.apiUrl +'/typeproducts/'+ typeId +'/products');
  }

}

