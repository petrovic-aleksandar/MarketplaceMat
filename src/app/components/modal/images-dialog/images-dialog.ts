import { ChangeDetectorRef, Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { Item } from '../../../model/item';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardActions, MatCardContent } from "@angular/material/card";
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../service/global-service';
import { finalize, } from 'rxjs';
import { ImageService } from '../../../service/image-service';
import { Image } from '../../../model/image';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-images-dialog',
  imports: [MatIcon, MatButton, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardActions, MatCardContent, MatTableModule],
  templateUrl: './images-dialog.html',
  styleUrl: './images-dialog.scss'
})
export class ImagesDialog {

  globalService = inject(GlobalService)
  imageService = inject(ImageService)
  http = inject(HttpClient)
  cdr = inject(ChangeDetectorRef)

  dialogRef = inject(MatDialogRef)

  item: Item | null = null
  images: Image[] = []
  image: Image | null = null

  fileName = '';

  cols: string[] = ["path", "front", "actions"]

  constructor(@Inject(MAT_DIALOG_DATA) item: Item) {
    if (item != null) {
      this.item = item;
      this.loadItemImages(this.item)
      this.cdr.markForCheck()
    }
  }

  view(i: Image) {
    this.image = i
  }

  makeFront(i: Image) {
    this.imageService.makeFront(this.item!.id, i.id).subscribe({
      next: (result) => {
        this.loadItemImages(this.item!)
      }
    })
  }

  delete(image: Image) {
    this.imageService.delete(image.id).subscribe({
      next: (result) => {
        this.loadItemImages(this.item!)
      }
    })
  }

  loadItemImages(item: Item) {
    this.imageService.getByItemId(item.id).subscribe({
      next: (images) => {
        this.images = <Image[]>images
        var frontImg = this.images.find(x => x.front == true)
        if (frontImg)
          this.image = frontImg
        this.cdr.markForCheck()
      }
    })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);

      this.http.post(this.globalService.getApi("Image") + this.item?.id, formData).subscribe({
        next: (result) => {
          this.reset()
        }
      });
    }
  }

  reset() {
    this.loadItemImages(this.item!);
  }

  close() {
    this.dialogRef.close()
  }

  path(): string {
    return this.globalService.getImagePath(this.item?.id + "/" + this.image?.path)
  }

}
