import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegUser } from '../../model/request/reg-user';
import { AuthService } from '../../service/auth-service';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatCardFooter, MatFormField, MatLabel, MatError, MatButton, MatInput, MatCardSubtitle, MatIcon],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  // injected services
  authService = inject(AuthService)
  router = inject(Router)
  fb = inject(FormBuilder)

  // reactive state
  loading = signal(false)

  // reactive form (typed)
  userForm: FormGroup = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  })

  // actions
  reset() {
    this.userForm.reset()
  }

  register() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched()
      return
    }

    const payload: RegUser = this.userForm.getRawValue()

    this.loading.set(true)
    this.authService.register(payload).pipe(
      tap(() => {
        alert("Account created. you will be redirected to login page, where you can log in with your username and password.")
        this.router.navigateByUrl("/login")
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Unexpected error'
        alert(message)
        return of(null)
      }),
      finalize(() => this.loading.set(false))
    ).subscribe()
  }

}
