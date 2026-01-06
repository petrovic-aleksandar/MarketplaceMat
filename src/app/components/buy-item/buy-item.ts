import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../service/auth-service';
import { GlobalService } from '../../service/global-service';
import { Image } from '../../model/image';
import { ImageService } from '../../service/image-service';
import { Item } from '../../model/item';
import { TransferReq } from '../../model/request/transfer-req';
import { ItemService } from '../../service/item-service';
import { TransferService } from '../../service/transfer-service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-buy-item',
  imports: [MatIcon, RouterLink, MatButton, MatGridListModule],
  templateUrl: './buy-item.html',
  styleUrl: './buy-item.scss'
})
export class BuyItem implements OnInit {

  // injected services
  globalService = inject(GlobalService)
  authService = inject(AuthService)
  itemService = inject(ItemService)
  imageService = inject(ImageService)
  transferService = inject(TransferService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  cdr = inject(ChangeDetectorRef)

  // reactive state
  item = signal<Item | null>(null)
  images = signal<Image[]>([])
  loadingItem = signal(true)
  loadingImages = signal(true)
  purchaseLoading = signal(false)

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id')
    const id = Number(idParam)
    if (!id) {
      alert('Invalid item id')
      this.router.navigateByUrl('/item-types')
      return
    }
    this.loadItem(id)
    this.loadItemImages(id)
  }

  loadItem(id: number) {
    this.loadingItem.set(true)
    this.itemService.getById(id).pipe(
      tap((result) => {
        this.item.set(result as Item)
        this.cdr.markForCheck()
      }),
      catchError(() => {
        alert('Failed to load item')
        return of(null)
      }),
      finalize(() => this.loadingItem.set(false))
    ).subscribe()
  }

  loadItemImages(itemId: number) {
    this.loadingImages.set(true)
    this.imageService.getByItemId(itemId).pipe(
      tap((images) => {
        this.images.set(images as Image[])
        this.cdr.markForCheck()
      }),
      catchError(() => {
        alert('Failed to load images')
        return of([] as Image[])
      }),
      finalize(() => this.loadingImages.set(false))
    ).subscribe()
  }

  path(path: string): string {
    const current = this.item()
    return this.globalService.getImagePath((current?.id ?? "") + "/" + path)
  }

  buy() {
    const current = this.item()
    if (!current) return
    if (current.seller?.id === this.authService.loggedUserId) {
      alert("You cannot purchase your own items.")
      return
    }

    const t: TransferReq = {
      amount: current.price,
      type: "Purchase",
      buyerId: this.authService.loggedUserId,
      sellerId: current.seller.id,
      itemId: current.id
    }

    this.purchaseLoading.set(true)
    this.transferService.addPurchase(t).pipe(
      tap(() => {
        alert("Purchase successful! The purchase amount was subtracted from your amount, and item has been moved to your possession. You will be redirected to your items page, where you will find your new item :)")
        this.router.navigateByUrl("/user-items")
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Purchase failed'
        alert(message)
        return of(null)
      }),
      finalize(() => this.purchaseLoading.set(false))
    ).subscribe()
  }

}
