import { SharedModule } from './../shared.module';
import { LogoutComponent } from './logout/logout.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';;
import { UsersRoutingModule } from './users-routing.module';
import { LoginComponent } from './login/login.component';
// Angular

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    LoginComponent, LogoutComponent
  ]
})
export class UsersModule { }
