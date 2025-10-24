import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { UserDialog } from '../components/modal/user-dialog/user-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemDialog } from '../components/modal/item-dialog/item-dialog';
import { Item } from '../model/item';
import { ImagesDialog } from '../components/modal/images-dialog/images-dialog';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  dialog = inject(MatDialog)

  getApi (path:string) {
    return "https://localhost:7294/api/" + path + "/"
    //return "https://localhost:5001/api/" + path + "/"
    //return "http://localhost:8080/marketplace-java/api/v1/" + path + "/"
  }

  getImagePath(path:string) {
    return "http://localhost:80/"+ path
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
  
}
