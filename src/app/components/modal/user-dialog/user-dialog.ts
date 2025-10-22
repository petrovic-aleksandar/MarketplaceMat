import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardSubtitle, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { UserReq } from '../../../model/request/user-req';
import { UserService } from '../../../service/user-service';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../model/user';
import { MatOption, MatSelect } from "@angular/material/select";

@Component({
  selector: 'app-user-dialog',
  imports: [ReactiveFormsModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatFormField, MatLabel, MatInput, MatCardSubtitle, MatIcon, MatButton, MatSelect, MatOption, MatCardActions, MatError],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss'
})
export class UserDialog {

  userService = inject(UserService)
  http = inject(HttpClient)
  cdr = inject(ChangeDetectorRef)

  dialogRef = inject(MatDialogRef<UserDialog>)

  userRoles: string[] = []

  constructor(@Inject(MAT_DIALOG_DATA) user: User) {
    if (user != null)
      this.userToform(user)
    this.loadRoles()
  }

  userForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required]),
    role: new FormControl(null, [Validators.required])
  })

  userToform(user: User) {
    this.userForm.setValue({
      id: user.id,
      username: user.username,
      password: "",
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    })
  }

  formToUserReq(): UserReq {
    return {
      username: this.userForm.value.username,
      password: this.userForm.value.password,
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      phone: this.userForm.value.phone,
      role: this.userForm.value.role
    }
  }

  loadRoles() {
    this.userService.getRoles().subscribe((result: any) => {
      this.userRoles = result
      this.cdr.markForCheck()
    })
  }

  reset() {
    this.userForm.reset()
  }

  close() {
    this.dialogRef.close()
  }

  add() {
    this.userService.add(this.formToUserReq()).subscribe({
      next: (result) => {
        alert("User created.")
        this.dialogRef.close()
      },
      error: (err) => {
        if (err.status == 200) {
          alert("User created.")
          this.dialogRef.close()
          return
        }
        if (err.status == 409) {
          alert("Username already exists. Please choose another username.")
        } else {
          console.log(err)
          alert("error: " + err.error)
        }
      }
    });
  }

  update() {
    this.userService.update(this.formToUserReq(), this.userForm.value.id).subscribe({
      next: (result) => {
        alert("User updated.")
        this.dialogRef.close()
      },
      error: (error) => {
        alert("error: " + error.error)
      }
    })
  }

}
