import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../service/auth-service';
import { Transfer } from '../../model/transfer';
import { TransferService } from '../../service/transfer-service';
import { User } from '../../model/user';
import { UserService } from '../../service/user-service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-user-transfers',
  imports: [MatTableModule, MatProgressSpinnerModule, MatProgressSpinner, DatePipe, NgClass],
  templateUrl: './user-transfers.html',
  styleUrl: './user-transfers.scss'
})
export class UserTransfers implements OnInit {

  // injected services
  authService = inject(AuthService)
  transferService = inject(TransferService)
  userService = inject(UserService)

  // reactive state
  user = signal<User | null>(null)
  transfers = signal<Transfer[]>([])
  loadingUser = signal(true)
  loadingTransfers = signal(true)

  cols = ["amount", "time", "type", "buyer", "seller", "item"]

  ngOnInit(): void {
    this.loadUser()
    this.loadTransfers()
  }

  loadUser() {
    this.loadingUser.set(true)
    this.authService.selfInfo().pipe(
      tap((user) => {
        this.user.set(user as User)
      }),
      catchError(() => {
        alert('Failed to load user')
        return of(null)
      }),
      finalize(() => this.loadingUser.set(false))
    ).subscribe()
  }

  loadTransfers() {
    this.loadingTransfers.set(true)
    this.transferService.getByUserId(this.authService.loggedUserId).pipe(
      tap((transfers) => {
        this.transfers.set(transfers as Transfer[])
      }),
      catchError(() => {
        alert('Failed to load transfers')
        return of([] as Transfer[])
      }),
      finalize(() => this.loadingTransfers.set(false))
    ).subscribe()
  }

}
