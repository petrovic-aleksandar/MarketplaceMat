import { Component, inject, Inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../model/user';
import { TransferService } from '../../../service/transfer-service';
import { UserService } from '../../../service/user-service';
import { Transfer } from '../../../model/transfer';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCard, MatCardHeader, MatCardContent, MatCardActions, MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TransferReq } from '../../../model/request/transfer-req';
import { DatePipe, NgClass } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-transfers-dialog',
  imports: [ReactiveFormsModule, MatTableModule, MatPaginator, MatCard, MatCardHeader, MatCardContent, MatCardActions, MatIcon, MatButton, MatFormField, MatInput, MatLabel, MatSelectModule, MatCardTitle, MatCardSubtitle, DatePipe, NgClass, MatProgressSpinner, MatError],
  templateUrl: './transfers-dialog.html',
  styleUrl: './transfers-dialog.scss'
})
export class TransfersDialog {

  // injected services
  transferService = inject(TransferService)
  userService = inject(UserService)
  dialogRef = inject(MatDialogRef)
  fb = inject(FormBuilder)

  // reactive state
  user = signal<User | null>(null)
  transfers = signal<Transfer[]>([])
  loadingUser = signal(true)
  loadingTransfers = signal(true)
  submitting = signal(false)
  error = signal<string | null>(null)

  // table
  transfersDS = new MatTableDataSource<Transfer>()
  cols = ["amount", "time", "type", "buyer", "seller", "item"]
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // reactive form (typed)
  transferForm: FormGroup = this.fb.nonNullable.group({
    type: [null as string | null, Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
  })

  constructor(@Inject(MAT_DIALOG_DATA) user: User) {
    this.loadUser(user.id)
    this.loadTransfers(user.id)
  }

  private reloadData(userId: number) {
    // reload user and transfers together so view updates without full page refresh
    this.loadingUser.set(true)
    this.loadingTransfers.set(true)

    forkJoin({
      user: this.userService.getById(userId),
      transfers: this.transferService.getByUserId(userId)
    }).pipe(
      tap(({ user, transfers }) => {
        this.user.set(user as User)
        this.transfers.set(transfers as Transfer[])
        this.transfersDS.data = this.transfers()
        if (this.paginator) {
          this.transfersDS.paginator = this.paginator
        }
        this.error.set(null)
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Failed to reload data'
        this.error.set(message)
        return of({ user: null, transfers: [] as Transfer[] })
      }),
      finalize(() => {
        this.loadingUser.set(false)
        this.loadingTransfers.set(false)
      })
    ).subscribe()
  }

  loadUser(userId: number) {
    this.loadingUser.set(true)
    this.userService.getById(userId).pipe(
      tap((user) => {
        this.user.set(user as User)
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Failed to load user'
        this.error.set(message)
        return of(null)
      }),
      finalize(() => this.loadingUser.set(false))
    ).subscribe()
  }

  loadTransfers(userId: number) {
    this.loadingTransfers.set(true)
    this.transferService.getByUserId(userId).pipe(
      tap((transfers) => {
        this.transfers.set(transfers as Transfer[])
        this.transfersDS.data = this.transfers()
        this.transfersDS.paginator = this.paginator
        this.error.set(null)
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Failed to load transfers'
        this.error.set(message)
        return of([])
      }),
      finalize(() => this.loadingTransfers.set(false))
    ).subscribe()
  }

  transfer() {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched()
      return
    }

    const t: TransferReq = {
      userId: this.user()?.id!,
      amount: this.transferForm.getRawValue().amount
    }

    this.submitting.set(true)
    this.error.set(null)

    if (this.transferForm.getRawValue().type === "Payment") {
      this.transferService.addPayment(t).pipe(
        tap(() => {
          alert("Payment successful")
          this.transferForm.reset()
          this.reloadData(this.user()!.id)
        }),
        catchError((err: HttpErrorResponse) => {
          const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Payment failed'
          alert(message)
          this.error.set(message)
          return of(null)
        }),
        finalize(() => this.submitting.set(false))
      ).subscribe()
    } else if (this.transferForm.getRawValue().type === "Withdrawal") {
      this.transferService.addWithdrawal(t).pipe(
        tap(() => {
          alert("Withdrawal successful")
          this.transferForm.reset()
          this.reloadData(this.user()!.id)
        }),
        catchError((err: HttpErrorResponse) => {
          const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Withdrawal failed'
          alert(message)
          this.error.set(message)
          return of(null)
        }),
        finalize(() => this.submitting.set(false))
      ).subscribe()
    }
  }

  close() {
    this.dialogRef.close()
  }

}
