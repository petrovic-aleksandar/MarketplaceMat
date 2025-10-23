import { ChangeDetectorRef, Component, inject, NgModule, OnInit, resource } from '@angular/core';
import { MatGridList, MatGridListModule, MatGridTile, MatGridTileText } from '@angular/material/grid-list';
import { GlobalService } from '../../service/global-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemType } from '../../model/item-type';
import { MatAnchor, MatButton, MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { Item } from '../../model/item';
import { ItemService } from '../../service/item-service';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, NgModel } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

@Component({
  selector: 'app-items-by-type',
  imports: [MatGridListModule, MatAnchor, RouterLink, MatIcon, MatSliderModule, FormsModule, MatFormField, MatInput, MatLabel, MatButton],
  templateUrl: './items-by-type.html',
  styleUrl: './items-by-type.css'
})
export class ItemsByType {

  globalService = inject(GlobalService)
  itemService = inject(ItemService)
  cdr = inject(ChangeDetectorRef)

  type: ItemType | null = null
  typeId: number | null = null
  allItems: Item[] = []
  items: Item[] = []

  sliderMin: number = 0
  sliderMax: number = 0
  sliderStartThumb: number = 0
  sliderEndThumb: number = 0
  searchText: string | null = null

  constructor(route: ActivatedRoute) {
    var id = route.snapshot.paramMap.get('id')
    this.typeId = Number(id)
    this.loadItems(this.typeId)
  }

  loadItems(typeId: number) {
    this.itemService.getItemsByTypeId(typeId).subscribe({
      next: (result) => {
        this.allItems = <Item[]>result
        this.items = this.allItems
        this.setSliderRange()
        this.cdr.markForCheck()
      }
    })
  }

  setSliderRange() {
    this.sliderMin = this.allItems.reduce((min, item) => item.price < min ? item.price : min, Infinity)
    this.sliderMax = this.allItems.reduce((max, item) => item.price > max ? item.price : max, 0)
    this.sliderStartThumb = this.sliderMin
    this.sliderEndThumb = this.sliderMax
  }

  filterByPrice() {
    this.items = this.allItems.filter(x => x.price >= this.sliderStartThumb && x.price <= this.sliderEndThumb)
  }

  filterByText() {
    if (this.searchText != null)
      this.items = this.allItems.filter(x => x.name.toLowerCase().includes(this.searchText!.toLowerCase()) || x.description.toLowerCase().includes(this.searchText!.toLowerCase()))
  }

  resetSearchText() {
    this.searchText = null
    this.items = this.allItems
  }

  path(item: Item): string {
    if (item.frontImage.path == null)
      return this.defaultPath();
    return this.globalService.getImagePath(item.seller.id + "/" + item.id + "/" + item.frontImage.path)
  }

  defaultPath() {
    return this.globalService.getImagePath("default.jpg")
  }

}
