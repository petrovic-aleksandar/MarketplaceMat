import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, MonetaryPipe, MatSelectModule, MatTableModule, MatButton, MatIcon],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  userService = inject(UserService)
  globalService = inject(GlobalService)
  dialog = inject(MatDialog)
  cdr = inject(ChangeDetectorRef)

  userList: User[] = []
  usersTableCols: string[] = ['id', 'role', 'username', 'name', 'email', 'phone', 'role', 'active', 'actions'];

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.userService.getAll().subscribe((result: any) => {
      this.userList = result
      this.cdr.markForCheck()
    })
  }

  addUser() {
    this.globalService.userDialog().afterClosed().subscribe(() => {
      this.loadUsers()
    })
  }

  editUser(user: User) {
    this.globalService.userDialog(user).afterClosed().subscribe(() => {
      this.loadUsers()
    })
  }

  deactivateUser(userId: number) {
    this.userService.deactivate(userId).subscribe({
      next: (result) => {
        alert("User deactivated.")
        this.loadUsers()
      },
      error: (error) => {
        alert("error: " + error.error)
      }
    })
  }

  activateUser(userId: number) {
    this.userService.activate(userId).subscribe({
      next: (result) => {
        alert("User activated.")
        this.loadUsers()
      },
      error: (error) => {
        alert("error: " + error.error)
      }
    })
  }
}
