import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable()
export class CanActivateFlexiEspumasAuthGuard implements CanActivate {

    constructor(private authService: UserService, private router: Router) { }

    canActivate() {
        if (!this.authService.isLogged()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}