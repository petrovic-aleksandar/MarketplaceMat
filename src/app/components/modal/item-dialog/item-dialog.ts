import { Component, Inject, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatError, MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Item } from '../../../model/item';
import { ItemType } from '../../../model/item-type';
import { ItemReq } from '../../../model/request/item-req';
import { AuthService } from '../../../service/auth-service';
import { ItemService } from '../../../service/item-service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-item-dialog',
  imports: [ReactiveFormsModule, MatInput, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatButton, MatFormField, MatLabel, MatError, MatSelect, MatOption, MatIcon],
  templateUrl: './item-dialog.html',
  styleUrl: './item-dialog.scss'
})
export class ItemDialog {

  // injected services
  itemService = inject(ItemService)
  authService = inject(AuthService)
  dialogRef = inject(MatDialogRef)
  fb = inject(FormBuilder)

  // reactive state
  itemTypes = signal<ItemType[]>([])
  loadingTypes = signal(true)
  submitting = signal(false)
  isEdit = signal(false)
  itemId = signal(0)

  // initial form state (for reset)
  initialFormValue: any = null

  // reactive form (typed)
  itemForm: FormGroup = this.fb.nonNullable.group({
    id: [0],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0],
    typeId: [null as number | null, Validators.required],
    sellerId: [0]
  })

  constructor(@Inject(MAT_DIALOG_DATA) item: Item | null) {
    if (item != null) {
      this.isEdit.set(true)
      this.itemId.set(item.id)
      this.itemToForm(item)
    }
    this.loadItemTypes()
  }

  loadItemTypes() {
    this.loadingTypes.set(true)
    this.itemService.getTypes().pipe(
      tap((types) => {
        this.itemTypes.set(types as ItemType[])
      }),
      catchError(() => {
        alert('Failed to load item types')
        return of([] as ItemType[])
      }),
      finalize(() => this.loadingTypes.set(false))
    ).subscribe()
  }

  itemToForm(item: Item) {
    this.itemForm.reset({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      typeId: item.type.id,
      sellerId: item.seller.id
    })
    // Store initial form value for reset
    this.initialFormValue = this.itemForm.getRawValue()
  }

  formToItemReq(): ItemReq {
    return {
      name: this.itemForm.getRawValue().name,
      description: this.itemForm.getRawValue().description,
      price: this.itemForm.getRawValue().price,
      typeId: this.itemForm.getRawValue().typeId,
      sellerId: this.authService.loggedUserId
    }
  }

  // actions
  close() {
    this.dialogRef.close()
  }

  reset() {
    if (this.isEdit()) {
      // Restore to initial values for edit mode
      if (this.initialFormValue) {
        this.itemForm.patchValue(this.initialFormValue)
      }
    } else {
      // Clear form for new item mode
      this.itemForm.reset()
    }
  }

  save() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched()
      return
    }

    this.submitting.set(true)

    const request$ = this.isEdit()
      ? this.itemService.update(this.itemId(), this.formToItemReq())
      : this.itemService.add(this.formToItemReq())

    request$.pipe(
      tap(() => {
        const message = this.isEdit() ? "Item updated." : "Item created."
        alert(message)
        this.dialogRef.close()
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? (this.isEdit() ? 'Update failed' : 'Create failed')
        alert(message)
        return of(null)
      }),
      finalize(() => this.submitting.set(false))
    ).subscribe()
  }
   
}
