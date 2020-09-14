import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http:HttpClient, private router:Router) { }

  getAllProducts(){
      return this.http.get(environment.apiUrl + '/products');
  }

  deleteProductById(item){
    return this.http.delete(environment.apiUrl +'/products/' + item);
  }

  saveProduct(data){
    return this.http.post(environment.apiUrl +'/products', data);
  }

  updateProduct(data){
    return this.http.put(environment.apiUrl +'/products/' + data.id, data);
  }

}

