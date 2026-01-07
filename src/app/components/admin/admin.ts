import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/user-service';
import { User } from '../../model/user';
import { MonetaryPipe } from '../../pipes/monetary-pipe';
import { GlobalService } from '../../service/global-service';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, MonetaryPipe, MatSelectModule, MatTableModule, MatProgressSpinnerModule, NgClass, MatButton, MatIcon],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

  // injected services
  userService = inject(UserService)
  globalService = inject(GlobalService)
  dialog = inject(MatDialog)

  // reactive state
  userList = signal<User[]>([])
  loading = signal(true)
  toggleActiveId = signal<number | null>(null)
  error = signal<string | null>(null)

  // constants
  usersTableCols: string[] = ['id', 'role', 'username', 'name', 'email', 'phone', 'balance', 'active', 'actions']

  constructor() {
    this.loadUsers()
  }

  // data loading
  loadUsers() {
    this.loading.set(true)
    this.userService.getAll().pipe(
      tap((users) => {
        this.userList.set(users)
        this.error.set(null)
      }),
      catchError(() => {
        this.error.set('Failed to load users')
        this.userList.set([])
        return of([] as User[])
      }),
      finalize(() => this.loading.set(false))
    ).subscribe()
  }

  // actions
  addUser() {
    this.globalService.userDialog().afterClosed().pipe(
      tap(() => this.loadUsers())
    ).subscribe()
  }

  editUser(user: User) {
    this.globalService.userDialog(user).afterClosed().pipe(
      tap(() => this.loadUsers())
    ).subscribe()
  }

  userTransfers(user: User) {
    this.globalService.transfersDialog(user).afterClosed().pipe(
      tap(() => this.loadUsers())
    ).subscribe()
  }

  deactivateUser(userId: number) {
    this.toggleActiveId.set(userId)
    this.userService.deactivate(userId).pipe(
      tap(() => {
        alert("User deactivated.")
        this.loadUsers()
      }),
      catchError((error) => {
        alert("error: " + error.error)
        return of(null)
      }),
      finalize(() => this.toggleActiveId.set(null))
    ).subscribe()
  }

  activateUser(userId: number) {
    this.toggleActiveId.set(userId)
    this.userService.activate(userId).pipe(
      tap(() => {
        alert("User activated.")
        this.loadUsers()
      }),
      catchError((error) => {
        alert("error: " + error.error)
        return of(null)
      }),
      finalize(() => this.toggleActiveId.set(null))
    ).subscribe()
  }
}
