import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../service/item-service';
import { Item } from '../../model/item';
import { DatePipe, NgClass } from '@angular/common';
import { AuthService } from '../../service/auth-service';
import { GlobalService } from '../../service/global-service';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-user-items',
  imports: [ReactiveFormsModule, DatePipe, MatSelectModule, MatTableModule, NgClass, MatButton, MatIcon],
  templateUrl: './user-items.html',
  styleUrl: './user-items.css'
})
export class UserItems {

  // injected services
  globalService = inject(GlobalService)
  itemService = inject(ItemService)
  authService = inject(AuthService)

  // reactive state
  itemList = signal<Item[]>([])
  loading = signal(true)
  toggleActiveId = signal<number | null>(null)
  deletingId = signal<number | null>(null)
  error = signal<string | null>(null)

  // constants
  itemsTableCols: string[] = ['id', 'name', 'description', 'price', 'type', 'active', 'actions']

  constructor() {
    this.loadItemsByUser()
  }

  // data loading
  loadItemsByUser() {
    this.loading.set(true)
    this.itemService.getByUserId(this.authService.loggedUserId).pipe(
      tap((items) => {
        this.itemList.set(items)
        this.error.set(null)
      }),
      catchError(() => {
        this.error.set('Failed to load items')
        this.itemList.set([])
        return of([] as Item[])
      }),
      finalize(() => this.loading.set(false))
    ).subscribe()
  }

  // actions
  images(item: Item) {
    this.globalService.imagesDialog(item)
  }

  add() {
    this.globalService.itemDialog().afterClosed().pipe(
      tap(() => this.loadItemsByUser())
    ).subscribe()
  }

  edit(item: Item) {
    this.globalService.itemDialog(item).afterClosed().pipe(
      tap(() => this.loadItemsByUser())
    ).subscribe()
  }

  deactivate(id: number) {
    this.toggleActiveId.set(id)
    this.itemService.deactivate(id).pipe(
      tap(() => {
        alert("Item deactivated.")
        this.loadItemsByUser()
      }),
      catchError((error) => {
        alert("error: " + error.error)
        return of(null)
      }),
      finalize(() => this.toggleActiveId.set(null))
    ).subscribe()
  }

  activate(id: number) {
    this.toggleActiveId.set(id)
    this.itemService.activate(id).pipe(
      tap(() => {
        alert("Item activated.")
        this.loadItemsByUser()
      }),
      catchError((error) => {
        alert("error: " + error.error)
        return of(null)
      }),
      finalize(() => this.toggleActiveId.set(null))
    ).subscribe()
  }

  delete(id: number) {
    this.deletingId.set(id)
    this.itemService.delete(id).pipe(
      tap(() => {
        alert("item deleted")
        this.loadItemsByUser()
      }),
      catchError((error) => {
        alert("error: " + error.error)
        return of(null)
      }),
      finalize(() => this.deletingId.set(null))
    ).subscribe()
  }
}
