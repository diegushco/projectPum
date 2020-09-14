import { Component } from '@angular/core';
import { User } from '../../models/users/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent {

  constructor(private _userService:UserService, private router: Router){
    this.logout();
  }

  logout(){
    this._userService.logout();
  }
    
}
