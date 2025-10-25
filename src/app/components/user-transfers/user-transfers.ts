import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Transfer } from '../../model/transfer';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../service/auth-service';
import { TransferService } from '../../service/transfer-service';
import { User } from '../../model/user';
import { UserService } from '../../service/user-service';

@Component({
  selector: 'app-user-transfers',
  imports: [MatTableModule],
  templateUrl: './user-transfers.html',
  styleUrl: './user-transfers.scss'
})
export class UserTransfers implements OnInit {

  authService = inject(AuthService)
  transferService = inject(TransferService)
  userService = inject(UserService)
  cdr = inject(ChangeDetectorRef)

  transfers: Transfer[] = []
  user: User | null = null

  cols = ["amount", "time", "type", "buyer", "seller", "item"]

  ngOnInit(): void {
    this.loadUser()
    this.loadTransfers()
  }

  loadUser() {
    this.userService.getById(this.authService.loggedUserId).subscribe({
      next: (user) => {
        this.user = <User>user
        this.cdr.markForCheck()
      }
    })
  }

  loadTransfers() {
    this.transferService.getByUserId(this.authService.loggedUserId).subscribe({
      next: (transfers) => {
        this.transfers = <Transfer[]>transfers
        this.cdr.markForCheck()
      }
    })
  }

}
