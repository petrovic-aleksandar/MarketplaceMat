import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of, tap } from 'rxjs';
import { ItemType } from '../../model/item-type';
import { GlobalService } from '../../service/global-service';
import { ItemService } from '../../service/item-service';

@Component({
  selector: 'app-item-types',
  imports: [MatGridListModule, RouterLink, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './item-types.html',
  styleUrl: './item-types.css'
})
export class ItemTypes {

  // injected services
  globalService = inject(GlobalService)
  itemService = inject(ItemService)

  // reactive state
  loading = signal(true)
  error = signal<string | null>(null)

  // data loading
  itemTypes = toSignal(
    this.itemService.getTypes().pipe(
      tap(() => {
        this.loading.set(false)
        this.error.set(null)
      }),
      catchError(() => {
        this.loading.set(false)
        this.error.set('Failed to load item types')
        return of([] as ItemType[])
      })
    ),
    { initialValue: [] as ItemType[] }
  )

  // helpers
  pathById(path: string) {
    return this.globalService.getImagePath(path)
  } 

}
