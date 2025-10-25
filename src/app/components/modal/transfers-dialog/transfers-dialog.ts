import { ChangeDetectorRef, Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../model/user';
import { TransferService } from '../../../service/transfer-service';
import { UserService } from '../../../service/user-service';
import { Transfer } from '../../../model/transfer';
import { MatTableModule } from '@angular/material/table';
import { MatCard, MatCardHeader, MatCardContent, MatCardActions, MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TransferReq } from '../../../model/request/transfer-req';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transfers-dialog',
  imports: [ReactiveFormsModule, MatTableModule, MatCard, MatCardHeader, MatCardContent, MatCardActions, MatIcon, MatButton, MatFormField, MatInput, MatLabel, MatSelectModule, MatCardTitle, MatCardSubtitle, DatePipe],
  templateUrl: './transfers-dialog.html',
  styleUrl: './transfers-dialog.scss'
})
export class TransfersDialog {

  transferService = inject(TransferService)
  userService = inject(UserService)
  cdr = inject(ChangeDetectorRef)

  dialogRef = inject(MatDialogRef)

  transfers: Transfer[] = []
  user: User | null = null

  cols = ["amount", "time", "type", "buyer", "seller", "item"]

  transferForm: FormGroup = new FormGroup({
    type: new FormControl(null, Validators.required),
    amount: new FormControl(0),
  })

  constructor(@Inject(MAT_DIALOG_DATA) user: User) {
    this.loadUser(user.id)
    this.loadTransfers(user.id)
  }

  formToTransfer(): TransferReq {
    return {
      type: this.transferForm.value.type,
      amount: this.transferForm.value.amount
    }
  }

  loadUser(userId: number) {
    this.userService.getById(userId).subscribe({
      next: (user) => {
        this.user = <User>user
        this.cdr.markForCheck()
      }
    })
  }

  loadTransfers(userId: number) {
    this.transferService.getByUserId(userId).subscribe({
      next: (transfers) => {
        this.transfers = <Transfer[]>transfers
        this.cdr.markForCheck()
      }
    })
  }

  transfer() {
    var t: TransferReq = this.formToTransfer()
    if (t.type === "Payment") {
      t.sellerId = this.user?.id
      this.transferService.addPayment(t).subscribe({
        next: (res) => {
          this.loadUser(this.user!.id)
          this.loadTransfers(this.user!.id)
        }
      })
    }
    if (t.type === "Withdrawal") {
      t.buyerId = this.user?.id
      this.transferService.addWithdrawal(t).subscribe({
        next: (res) => {
          this.loadUser(this.user!.id)
          this.loadTransfers(this.user!.id)
        },
        error: (err) => {
          if (err.error == "Not enough money!")
            alert(err.error)
        }
      })
    }
  }

  close() {
    this.dialogRef.close()
  }

}
