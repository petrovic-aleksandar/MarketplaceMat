import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../service/item-service';
import { Item } from '../../model/item';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../service/auth-service';
import { GlobalService } from '../../service/global-service';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-items',
  imports: [ReactiveFormsModule, DatePipe, MatSelectModule, MatTableModule, MatButton, MatIcon],
  templateUrl: './user-items.html',
  styleUrl: './user-items.css'
})
export class UserItems implements OnInit {

  globalService = inject(GlobalService)
  itemService = inject(ItemService)
  authService = inject(AuthService)
  http = inject(HttpClient)
  dialog = inject(MatDialog)
  cdr = inject(ChangeDetectorRef)

  itemList: Item[] = []
  itemsTableCols: string[] = ['id', 'name', 'description', 'price', 'type', 'active', 'actions'];

  ngOnInit(): void {
    this.loadItemsByUser()
  }

  loadItemsByUser() {
    this.itemService.getByUserId(this.authService.loggedUserId).subscribe({
      next: (items) => {
        this.itemList = items as Item[]
        this.cdr.markForCheck()
      }
    })
  }

  images(item: Item) {
    this.globalService.imagesDialog(item);
  }

  add() {
    this.globalService.itemDialog().afterClosed().subscribe(() => {
      this.loadItemsByUser()
    })
  }

  edit(item: Item) {
    this.globalService.itemDialog(item).afterClosed().subscribe(() => {
      this.loadItemsByUser()
    })
  }

  deactivate(id: number) {
    this.itemService.deactivate(id).subscribe({
      next: () => {
        alert("Item deactivated.")
        this.loadItemsByUser()
      },
      error: (error) => {
        if (error.status == 200) {
          alert("Item deactivated.")
          this.loadItemsByUser()
          return
        }
        alert("error: " + error.error)
      }
    })
  }

  activate(id: number) {
    this.itemService.activate(id).subscribe({
      next: () => {
        alert("Item activated.")
        this.loadItemsByUser()
      },
      error: (error) => {
        if (error.status == 200) {
          alert("Item activated.")
          this.loadItemsByUser()
          return
        }
        alert("error: " + error.error)
      }
    })
  }

  delete(id: number) {
    this.itemService.delete(id).subscribe({
      next: () => {
        alert("item deleted")
        this.loadItemsByUser()
      },
      error: (error) => {
        if (error.status == 200) {
          alert("item deleted")
          this.loadItemsByUser()
          return
        }
        alert("error: " + error.error)
      }
    })
  }
}
