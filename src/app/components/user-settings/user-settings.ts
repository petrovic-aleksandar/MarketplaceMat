import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from '@angular/material/input';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth-service';
import { UserService } from '../../service/user-service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel, MatError, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatIcon, MatButton],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css'
})
export class UserSettings implements OnInit {

  // injected services
  authService = inject(AuthService)
  userService = inject(UserService)
  router = inject(Router)
  fb = inject(FormBuilder)

  // reactive state
  user = signal<User | null>(null)
  loadingUser = signal(true)
  updatingProfile = signal(false)
  updatingPassword = signal(false)
  error = signal<string | null>(null)

  // reactive forms (typed)
  userForm: FormGroup = this.fb.nonNullable.group({
    username: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  })

  passwordForm: FormGroup = this.fb.nonNullable.group({
    password: ['', Validators.required],
    repeat: ['', Validators.required],
  })

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser() {
    this.loadingUser.set(true)
    this.authService.selfInfo().pipe(
      tap((user) => {
        this.user.set(user as User)
        this.error.set(null)
        this.resetProfile()
      }),
      catchError(() => {
        this.error.set('Failed to load user')
        return of(null)
      }),
      finalize(() => this.loadingUser.set(false))
    ).subscribe()
  }

  // actions
  resetProfile() {
    const current = this.user()
    if (!current) return
    this.userForm.reset({
      username: current.username,
      name: current.name,
      email: current.email,
      phone: current.phone
    })
  }

  updateProfile() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched()
      return
    }

    const current = this.user()
    if (!current) return

    this.updatingProfile.set(true)
    const payload = {
      username: this.userForm.getRawValue().username,
      password: "",
      updatePassword: false,
      name: this.userForm.getRawValue().name,
      email: this.userForm.getRawValue().email,
      phone: this.userForm.getRawValue().phone,
      role: current.role
    }

    this.authService.updateSelf(payload).pipe(
      tap(() => {
        alert("Your profile data was successfully updated.")
        this.loadUser()
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Update failed'
        alert(message)
        return of(null)
      }),
      finalize(() => this.updatingProfile.set(false))
    ).subscribe()
  }

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched()
      return
    }

    const passwordValue = this.passwordForm.getRawValue().password
    const repeatValue = this.passwordForm.getRawValue().repeat

    if (passwordValue !== repeatValue) {
      alert('Passwords do not match')
      this.passwordForm.get('repeat')?.reset()
      return
    }

    const current = this.user()
    if (!current) return

    this.updatingPassword.set(true)
    const payload = {
      username: current.username,
      password: passwordValue,
      updatePassword: true,
      name: current.name,
      email: current.email,
      phone: current.phone,
      role: current.role
    }

    this.authService.updateSelf(payload).pipe(
      tap(() => {
        alert("Your password was successfully updated. Please log in with your new credentials.")
        localStorage.clear()
        this.authService.readLoggedUserFromStorage()
        this.router.navigateByUrl("/login")
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Update failed'
        alert(message)
        return of(null)
      }),
      finalize(() => this.updatingPassword.set(false))
    ).subscribe()
  }

}
