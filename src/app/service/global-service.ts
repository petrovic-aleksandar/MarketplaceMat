import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from '../api.config';
import { User } from '../model/user';
import { UserDialog } from '../components/modal/user-dialog/user-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemDialog } from '../components/modal/item-dialog/item-dialog';
import { Item } from '../model/item';
import { ImagesDialog } from '../components/modal/images-dialog/images-dialog';
import { TransfersDialog } from '../components/modal/transfers-dialog/transfers-dialog';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  dialog = inject(MatDialog)

  getApi(path: string) {
    return API_CONFIG.baseApiUrl + path + "/";
  }

  getImagePath(path: string) {
    return API_CONFIG.imagePath + path;
  }

  userDialog(user?: User): MatDialogRef<UserDialog> {
    return this.dialog.open(UserDialog, {
      disableClose: true,
      data: user ? user : null
    });
  }

  itemDialog(item?: Item): MatDialogRef<ItemDialog> {
    return this.dialog.open(ItemDialog, {
      disableClose: true,
      data: item ? item : null
    });
  }

  imagesDialog(item: Item): MatDialogRef<ImagesDialog> {
    return this.dialog.open(ImagesDialog, {
      disableClose: true,
      data: item
    });
  }

  transfersDialog(user: User): MatDialogRef<TransfersDialog> {
    return this.dialog.open(TransfersDialog, {
      disableClose: true,
      data: user
    });
  }
  
}
