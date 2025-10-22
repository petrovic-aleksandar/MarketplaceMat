import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginUser } from '../../model/request/login-user';
import { Component, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardFooter, MatCardActions } from '@angular/material/card';
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatInput } from '@angular/material/input';
import { MatButton } from "@angular/material/button";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatCard, MatFormField, MatCardActions, MatButton, MatLabel, MatInput, MatIcon, MatCardHeader, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardFooter, MatCardActions],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  authService = inject(AuthService)
  router = inject(Router)

  private readonly jwtHelper = new JwtHelperService()

  loginForm: FormGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  })

  loginFormToUser(): LoginUser {
    return {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }
  }

  login() {
    this.authService.login(this.loginFormToUser()).subscribe(
      (result) => {
        const x: any = result
        const token: any = x.accessToken;
        const decoded = this.jwtHelper.decodeToken(token)
        localStorage.setItem("loggedUser", decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'])
        localStorage.setItem("loggedUserId", decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])
        localStorage.setItem("loggedUserRole", decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
        localStorage.setItem("loggedUserToken", token)
        localStorage.setItem("loggedUserRefreshToken", x.refreshToken)
        this.authService.readLoggedUserFromStorage()
        this.router.navigateByUrl("/homepage")
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401)
          alert("Wrong password")
        if (error.status == 400)
          alert("Wrong credentials")
      })
  }
}
