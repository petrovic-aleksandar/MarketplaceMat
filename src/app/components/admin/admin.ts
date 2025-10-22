import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user-service';
import { User } from '../../model/user';
import { MonetaryPipe } from '../../pipes/monetary-pipe';
import { GlobalService } from '../../service/global-service';
import { UserReq } from '../../model/request/user-req';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { UserDialog } from '../modal/user-dialog/user-dialog';
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

  userForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required]),
    role: new FormControl(null, [Validators.required])
  })

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.userService.getAll().subscribe((result: any) => {
      this.userList = result
      this.cdr.markForCheck()
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

  addUser() {
    this.userDialog()
  }

  editUser(u: User) {
    this.userDialog(u)
  }

  userDialog(user?: User) {
    this.dialog.open(UserDialog, {
      width: '400px',
      disableClose: true,
      data: user ? user : null
    }).afterClosed().subscribe(() => {
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
