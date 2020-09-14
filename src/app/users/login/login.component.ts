import { Component } from '@angular/core';
import { User } from '../../models/users/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {

  username:string;
  password:string;
  error = '';

  constructor(private _userService:UserService,
     private router: Router,
     private _loading: NgxUiLoaderService){
       this._loading.start();
  }

  login(){
    const waitTime = timer(3000);
    const user:User = {
      username: this.username,
      password: this.password
    }
    this._userService.login(user).
    subscribe((data:any)=>{
      if(data.token){
        localStorage.setItem("_tokenFlexiEspumas", data.token)
        this.router.navigate(['/dashboard']);
      }else{
        this.error = data.message;
        this.password = '';
        waitTime.subscribe(()=> this.error = '' );
      }
    });
  }
}
