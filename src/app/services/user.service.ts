import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private router:Router) { }

  login(user){
    return this.http.post(environment.apiUrl +'/login',user).pipe(
      catchError((err)=>{
        return of(err.error.error);
      }),
      switchMap((data)=>{
        return of(data);
      })
    );
    
  }

  logout(){
    localStorage.removeItem("_tokenFlexiEspumas");
    this.router.navigate(['/users/login']);
  }

  isLogged(){
    if("_tokenFlexiEspumas" in localStorage){
        return true;
    } else {
        return false;
    }
  }
}

