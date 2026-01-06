import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardActions } from '@angular/material/card';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-user-dialog',
  imports: [ReactiveFormsModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatFormField, MatLabel, MatInput, MatCardSubtitle, MatIcon, MatButton, MatSelect, MatOption, MatCardActions, MatError, MatCheckbox],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss'
})
export class UserDialog {

  userService = inject(UserService)
  http = inject(HttpClient)
  dialogRef = inject(MatDialogRef<UserDialog>)
  fb = inject(FormBuilder)

  // reactive state
  roles = signal<string[]>([])
  submitting = signal(false)
  error = signal<string | null>(null)
  isEdit = signal(false)

  // form
  userForm: FormGroup = this.fb.nonNullable.group({
    id: [0],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    updatePassword: [true],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    role: [null as string | null, Validators.required]
  })

  constructor(@Inject(MAT_DIALOG_DATA) user: User | null) {
    if (user) {
      this.isEdit.set(true)
      this.userToForm(user)
    }
    this.loadRoles()
  }

  private userToForm(user: User) {
    this.userForm.setValue({
      id: user.id,
      username: user.username,
      password: '',
      updatePassword: false,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    })
    // disable password by default for edit mode
    this.userForm.get('password')?.disable()
  }

  private formToUserReq(): UserReq {
    const raw = this.userForm.getRawValue()
    return {
      username: raw.username,
      password: raw.updatePassword ? (raw.password ?? '') : '',
      updatePassword: raw.updatePassword,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      role: raw.role
    }
  }

  loadRoles() {
    this.userService.getRoles().pipe(
      tap((result: any) => this.roles.set(result as string[])),
      catchError(() => {
        this.error.set('Failed to load roles')
        return of([])
      })
    ).subscribe()
  }

  togglePassword() {
    const shouldUpdate = this.userForm.get('updatePassword')?.value
    const control = this.userForm.get('password')
    if (!shouldUpdate) {
      control?.reset()
      control?.disable()
    } else {
      control?.enable()
    }
  }

  reset() {
    if (this.isEdit()) {
      const currentId = this.userForm.get('id')?.value
      this.userForm.reset({
        id: currentId,
        username: this.userForm.get('username')?.value ?? '',
        password: '',
        updatePassword: false,
        name: this.userForm.get('name')?.value ?? '',
        email: this.userForm.get('email')?.value ?? '',
        phone: this.userForm.get('phone')?.value ?? '',
        role: this.userForm.get('role')?.value ?? null
      })
      this.userForm.get('password')?.disable()
    } else {
      this.userForm.reset({
        id: 0,
        username: '',
        password: '',
        updatePassword: true,
        name: '',
        email: '',
        phone: '',
        role: null
      })
      this.userForm.get('password')?.enable()
    }
  }

  close() {
    this.dialogRef.close()
  }

  save() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched()
      return
    }

    this.submitting.set(true)
    this.error.set(null)

    const req = this.formToUserReq()
    const request$ = this.isEdit()
      ? this.userService.update(req, this.userForm.getRawValue().id)
      : this.userService.add(req)

    request$.pipe(
      tap(() => {
        alert(this.isEdit() ? 'User updated.' : 'User created.')
        this.dialogRef.close(true)
      }),
      catchError((err) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? (this.isEdit() ? 'Update failed' : 'Create failed')
        if (err.status === 409) {
          alert('Username already exists. Please choose another username.')
        } else {
          alert(message)
        }
        this.error.set(message)
        return of(null)
      }),
      finalize(() => this.submitting.set(false))
    ).subscribe()
  }

}
