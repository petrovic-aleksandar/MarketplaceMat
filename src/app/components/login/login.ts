import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardFooter, MatCardActions } from '@angular/material/card';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatError, MatInput } from '@angular/material/input';
import { MatButton } from "@angular/material/button";
import { MatIcon } from '@angular/material/icon';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatCard, MatFormField, MatCardActions, MatButton, MatLabel, MatInput, MatIcon, MatCardHeader, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardFooter, MatCardActions, MatError],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  // injected services
  authService = inject(AuthService)
  router = inject(Router)
  jwtHelper = new JwtHelperService()
  fb = inject(FormBuilder)

  // reactive state
  loading = signal(false)

  // reactive form (typed)
  loginForm: FormGroup<{ username: FormControl<string>; password: FormControl<string>; }> = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  ngOnInit(): void {
    // redirect away if already authenticated
    const token = localStorage.getItem('loggedUserToken')
    const hasValidToken = token && !this.jwtHelper.isTokenExpired(token)
    if (hasValidToken) {
      this.authService.readLoggedUserFromStorage()
      this.router.navigateByUrl('/homepage')
    }
  }

  // actions
  login() {
    const credentials = this.loginForm.getRawValue()
    this.loading.set(true)
    this.authService.login(credentials).pipe(
      tap((result: any) => {
        const token: any = result.accessToken;
        const decoded = this.jwtHelper.decodeToken(token)
        localStorage.setItem("loggedUser", decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'])
        localStorage.setItem("loggedUserId", decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])
        localStorage.setItem("loggedUserRole", decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
        localStorage.setItem("loggedUserToken", token)
        localStorage.setItem("loggedUserRefreshToken", result.refreshToken)
        this.authService.readLoggedUserFromStorage()
        this.router.navigateByUrl("/homepage")
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) alert("Wrong credentials")
        if (error.status == 400) alert("Bad request")
        return of(null)
      }),
      finalize(() => this.loading.set(false))
    ).subscribe()
  }
}
