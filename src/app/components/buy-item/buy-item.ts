import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ItemService } from '../../service/item-service';
import { Item } from '../../model/item';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { MatButton } from '@angular/material/button';
import { MatGridListModule } from "@angular/material/grid-list";
import { Image } from '../../model/image';
import { ImageService } from '../../service/image-service';
import { GlobalService } from '../../service/global-service';

@Component({
  selector: 'app-buy-item',
  imports: [MatIcon, RouterLink, MatButton, MatGridListModule],
  templateUrl: './buy-item.html',
  styleUrl: './buy-item.scss'
})
export class BuyItem {

  globalService = inject(GlobalService)
  itemService = inject(ItemService)
  imageService = inject(ImageService)
  cdr = inject(ChangeDetectorRef)

  item: Item | null = null;
  images: Image[] = []

  constructor(route: ActivatedRoute) {
    var id = route.snapshot.paramMap.get('id')
    this.loadItem(Number(id))
    this.loadItemImages(Number(id))
  }

  loadItem(id: number) {
    this.itemService.getById(id).subscribe({
      next: (result) => {
        this.item = <Item>result
        this.cdr.markForCheck()
      }
    })
  }

  loadItemImages(itemId: number) {
    this.imageService.getByItemId(itemId).subscribe({
      next: (images) => {
        this.images = <Image[]>images
        this.cdr.markForCheck()
      }
    })
  }

  path(path:string): string {
    return this.globalService.getImagePath(this.item?.seller.id + "/" + this.item?.id + "/" + path)
  }

}
