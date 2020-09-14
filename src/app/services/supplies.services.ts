import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuppliesServices {

  constructor(private http:HttpClient, private router:Router) { }

  getAllSupplies(){
      return this.http.get(environment.apiUrl +'/supplies');
  }

  deleteSupplieById(item){
    return this.http.delete(environment.apiUrl +'/supplies/' + item);
  }

  saveSupplie(data){
    return this.http.post(environment.apiUrl +'/supplies', data);
  }

  updateSupplie(data){
    return this.http.put(environment.apiUrl +'/supplies/' + data.id, data);
  }

}

