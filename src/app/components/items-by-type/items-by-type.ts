import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton, MatAnchor, MatMiniFabButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { AuthService } from '../../service/auth-service';
import { Item } from '../../model/item';
import { ItemType } from '../../model/item-type';
import { GlobalService } from '../../service/global-service';
import { ItemService } from '../../service/item-service';

@Component({
  selector: 'app-items-by-type',
  imports: [MatGridListModule, MatAnchor, RouterLink, MatIcon, MatSliderModule, FormsModule, MatFormField, MatInput, MatLabel, MatButton, MatProgressSpinnerModule],
  templateUrl: './items-by-type.html',
  styleUrl: './items-by-type.css'
})
export class ItemsByType {
  
  // injected services
  globalService = inject(GlobalService)
  itemService = inject(ItemService)
  authService = inject(AuthService)
  router = inject(Router)

  // route context
  type: ItemType | null = null
  typeId: number | null = null

  // scalar UI state
  sliderMin = 0
  sliderMax = 0

  // reactive state
  loading = signal(true)
  error = signal<string | null>(null)
  allItems = signal<Item[]>([])
  sliderStartThumb = signal(0)
  sliderEndThumb = signal(0)
  searchText = signal('')

  // derived view model
  items = computed(() => {
    const source = this.allItems()
    const min = this.sliderStartThumb()
    const max = this.sliderEndThumb()
    const query = this.searchText().trim().toLowerCase()

    let filtered = source

    if (Number.isFinite(min) && Number.isFinite(max)) {
      filtered = filtered.filter(x => x.price >= min && x.price <= max)
    }

    if (query && query.length) {
      filtered = filtered.filter(x =>
        x.name.toLowerCase().includes(query) || x.description.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  constructor(route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id')
    this.typeId = Number(id)
    this.loadItems(this.typeId)
  }

  // data loading
  loadItems(typeId: number) {
    this.loading.set(true)
    this.itemService.getByTypeId(typeId).subscribe({
      next: (result) => {
        const data = result as Item[]
        this.allItems.set(data)
        this.setSliderRange(data)
        this.loading.set(false)
        this.error.set(null)
      },
      error: () => {
        this.loading.set(false)
        this.error.set('Failed to load items')
        this.allItems.set([])
      }
    })
  }

  // UI handlers
  setSliderRange(items: Item[]) {
    if (!items.length) {
      this.sliderMin = 0
      this.sliderMax = 0
      this.sliderStartThumb.set(0)
      this.sliderEndThumb.set(0)
      return
    }

    this.sliderMin = items.reduce((min, item) => item.price < min ? item.price : min, Infinity)
    this.sliderMax = items.reduce((max, item) => item.price > max ? item.price : max, 0)
    this.sliderStartThumb.set(this.sliderMin)
    this.sliderEndThumb.set(this.sliderMax)
  }

  resetSearchText() {
    this.searchText.set('')
    this.sliderStartThumb.set(this.sliderMin)
    this.sliderEndThumb.set(this.sliderMax)
  }

  // template accessors
  get sliderStartThumbValue() { return this.sliderStartThumb() }
  set sliderStartThumbValue(val: number) { this.sliderStartThumb.set(Number(val) || 0) }

  get sliderEndThumbValue() { return this.sliderEndThumb() }
  set sliderEndThumbValue(val: number) { this.sliderEndThumb.set(Number(val) || 0) }

  get searchTextValue() { return this.searchText() }
  set searchTextValue(val: string) { this.searchText.set((val ?? '').trim()) }

  // helpers
  path(item: Item): string {
    if (item.frontImage == null || item.frontImage.path == null)
      return this.defaultPath();
    return this.globalService.getImagePath(item.id + "/" + item.frontImage.path)
  }

  defaultPath() {
    return this.globalService.getImagePath("default.jpg")
  }

  buy(itemId: number) {
    if (this.authService.loggedUser() === "") {
      this.router.navigate(['/login'])
    } else {
      this.router.navigate(['/buy-item', itemId])
    }
  }

}
