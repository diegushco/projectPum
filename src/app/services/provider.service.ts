import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private http:HttpClient, private router:Router) { }

  getAllProvider(){
      return this.http.get(environment.apiUrl + '/providers');
  }

  deleteProviderById(item){
    return this.http.delete(environment.apiUrl + '/providers/' + item);
  }

  saveProvider(data){
    return this.http.post(environment.apiUrl + '/providers', data);
  }

  updateProvider(data){
    return this.http.put(environment.apiUrl + '/providers/' + data.id, data);
  }

}

