import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ItemService } from '../../service/item-service';
import { Item } from '../../model/item';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { MatButton } from '@angular/material/button';
import { MatGridListModule } from "@angular/material/grid-list";
import { Image } from '../../model/image';
import { ImageService } from '../../service/image-service';
import { GlobalService } from '../../service/global-service';
import { TransferService } from '../../service/transfer-service';
import { TransferReq } from '../../model/request/transfer-req';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-buy-item',
  imports: [MatIcon, RouterLink, MatButton, MatGridListModule],
  templateUrl: './buy-item.html',
  styleUrl: './buy-item.scss'
})
export class BuyItem {

  globalService = inject(GlobalService)
  authService = inject(AuthService)
  itemService = inject(ItemService)
  imageService = inject(ImageService)
  transferService = inject(TransferService)
  router = inject(Router)
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

  path(path: string): string {
    return this.globalService.getImagePath(this.item?.id + "/" + path)
  }

  buy() {
    if (this.item?.seller!.id === this.authService.loggedUserId) {
      alert("You cannot purchase your own items.")
    }
    var t: TransferReq = {
      amount: this.item!.price,
      type: "Purchase",
      buyerId: this.authService.loggedUserId,
      sellerId: this.item!.seller.id,
      itemId: this.item!.id
    }
    this.transferService.addPurchase(t).subscribe({
      next: (result) => {
        alert("Purchase successful! The purchase amount was subtracted from your amount, and item has been moved to your posession. You will be redirected to your items page, where you will find yuour new item :)")
        this.router.navigateByUrl("/user-items")
      },
      error: (err) => {
        if (err.error == "Not enough money!")
          alert(err.error)
      }
    })
  }

}
