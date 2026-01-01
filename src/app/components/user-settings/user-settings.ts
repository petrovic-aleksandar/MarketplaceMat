import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth-service';
import { UserService } from '../../service/user-service';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from "@angular/material/card";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";
import { MatButton } from '@angular/material/button';
import { parseHostBindings } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel, MatError, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatIcon, MatButton],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css'
})
export class UserSettings implements OnInit {

  authService = inject(AuthService)
  userService = inject(UserService)
  router = inject(Router)
  cdr = inject(ChangeDetectorRef)

  user: User | null = null

  userForm: FormGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required]),
  })

  passwordForm: FormGroup = new FormGroup({
    password: new FormControl("", [Validators.required]),
    repeat: new FormControl("", [Validators.required]),
  })

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser() {
    this.authService.selfInfo().subscribe({
      next: (user) => {
        this.user = <User>user
        this.resetProfile()
        this.cdr.markForCheck()
      }
    })
  }

  resetProfile() {
    this.userForm.setValue({
      username: this.user?.username,
      name: this.user?.name,
      email: this.user?.email,
      phone: this.user?.phone
    })
  }

  updateProfile() {
    this.authService.updateSelf({
      username: this.userForm.value.username,
      password: "",
      updatePassword: false,
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      phone: this.userForm.value.phone,
      role: this.user!.role
    }).subscribe({
      next: (result) => {
        alert("Your profile data was succesfully updated.")
        this.loadUser()
        this.resetProfile()
      }
    })
  }

  updatePassword() {
    this.authService.updateSelf({
      username: this.user!.username,
      password: this.passwordForm.value.password,
      updatePassword: true,
      name: this.user!.name,
      email: this.user!.email,
      phone: this.user!.phone,
      role: this.user!.role
    }).subscribe({
      next: (result) => {
        alert("Your password was succesfully updated. Please log in with your new credentials.")
      localStorage.clear()
      this.authService.readLoggedUserFromStorage()
      this.router.navigateByUrl("/login")
      }
    })
  }

}
