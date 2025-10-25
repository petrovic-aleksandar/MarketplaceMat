import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { ItemService } from '../../../service/item-service';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../../../model/item';
import { ItemType } from '../../../model/item-type';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemReq } from '../../../model/request/item-req';
import { AuthService } from '../../../service/auth-service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-item-dialog',
  imports: [ReactiveFormsModule, MatInput, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatButton, MatFormField, MatLabel, MatError, MatSelect, MatOption, MatIcon],
  templateUrl: './item-dialog.html',
  styleUrl: './item-dialog.scss'
})
export class ItemDialog {

  itemService = inject(ItemService)
  authService = inject(AuthService)
  http = inject(HttpClient)
  cdr = inject(ChangeDetectorRef)
  
  dialogRef = inject(MatDialogRef)

  itemTypes: ItemType[] = []

  itemForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    price: new FormControl(0),
    typeId: new FormControl(null, [Validators.required]),
    sellerId: new FormControl(0)
  })

  constructor(@Inject(MAT_DIALOG_DATA) item: Item) {
    if (item != null)
      this.itemToForm(item)
    this.loadItemTypes()
  }

  loadItemTypes() {
    this.itemService.getTypes().subscribe({
      next: (types) => {
        this.itemTypes = types as ItemType[]
        this.cdr.markForCheck()
      }
    })
  }

  itemToForm(item: Item) {
    this.itemForm.setValue({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      typeId: item.type.id,
      sellerId: item.seller.id
    })
  }

  formToItemReq(): ItemReq {
    return {
      name: this.itemForm.value.name,
      description: this.itemForm.value.description,
      price: this.itemForm.value.price,
      typeId: this.itemForm.value.typeId,
      sellerId: this.authService.loggedUserId
    }
  }

  close() {
    this.dialogRef.close()
  }

  reset() {
    this.itemForm.reset()
  }

  add() {
    this.itemService.add(this.formToItemReq()).subscribe({
      next: () => {
        alert("Item created.")
        this.dialogRef.close()
      },
      error: (error) => {
        if (error.status == 200) {
          alert("Item created.")
          this.dialogRef.close()
          return
        }
        alert("error: " + error.error)
      }
    });
  }

  update(id: number) {
    this.itemService.update(id, this.formToItemReq()).subscribe({
      next: () => {
        alert("Item updated.")
        this.dialogRef.close()
      },
      error: (error) => {
        if (error.status == 200) {
          alert("Item updated.")
          this.dialogRef.close()
          return
        }
        alert("error: " + error.error)
      }
    })
  }

}
