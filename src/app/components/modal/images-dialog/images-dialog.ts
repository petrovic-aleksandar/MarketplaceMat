import { Component, Inject, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { Item } from '../../../model/item';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardActions, MatCardContent } from "@angular/material/card";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalService } from '../../../service/global-service';
import { ImageService } from '../../../service/image-service';
import { Image } from '../../../model/image';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-images-dialog',
  imports: [MatIcon, MatButton, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardActions, MatCardContent, MatTableModule, MatProgressSpinner],
  templateUrl: './images-dialog.html',
  styleUrl: './images-dialog.scss'
})
export class ImagesDialog {

  globalService = inject(GlobalService)
  imageService = inject(ImageService)
  http = inject(HttpClient)
  dialogRef = inject(MatDialogRef)

  // reactive state
  item = signal<Item | null>(null)
  images = signal<Image[]>([])
  selectedImage = signal<Image | null>(null)
  loading = signal(false)
  uploading = signal(false)
  error = signal<string | null>(null)

  cols: string[] = ["path", "front", "actions"]

  constructor(@Inject(MAT_DIALOG_DATA) item: Item) {
    if (item) {
      this.item.set(item)
      this.loadItemImages(item)
    }
  }

  view(i: Image) {
    this.selectedImage.set(i)
  }

  makeFront(i: Image) {
    this.loading.set(true)
    this.imageService.makeFront(this.item()!.id, i.id).pipe(
      tap(() => {
        this.loadItemImages(this.item()!)
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Failed to set front image'
        this.error.set(message)
        return of(null)
      }),
      finalize(() => this.loading.set(false))
    ).subscribe()
  }

  delete(image: Image) {
    this.loading.set(true)
    this.imageService.delete(image.id).pipe(
      tap(() => {
        this.loadItemImages(this.item()!)
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Failed to delete image'
        this.error.set(message)
        return of(null)
      }),
      finalize(() => this.loading.set(false))
    ).subscribe()
  }

  loadItemImages(item: Item) {
    this.loading.set(true)
    this.imageService.getByItemId(item.id).pipe(
      tap((images) => {
        const imageList = images as Image[]
        this.images.set(imageList)
        const frontImg = imageList.find(x => x.front)
        if (frontImg) {
          this.selectedImage.set(frontImg)
        }
        this.error.set(null)
      }),
      catchError((err: HttpErrorResponse) => {
        const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Failed to load images'
        this.error.set(message)
        return of([])
      }),
      finalize(() => this.loading.set(false))
    ).subscribe()
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.uploading.set(true)
      this.error.set(null)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);

      this.http.post(this.globalService.getApi("Image") + this.item()?.id, formData).pipe(
        tap(() => {
          this.reset()
        }),
        catchError((err: HttpErrorResponse) => {
          const message = (err.error as any)?.message ?? err.error ?? err.message ?? 'Failed to upload image'
          alert(message)
          this.error.set(message)
          return of(null)
        }),
        finalize(() => this.uploading.set(false))
      ).subscribe()
    }
  }

  reset() {
    this.loadItemImages(this.item()!);
  }

  close() {
    this.dialogRef.close()
  }

  path(): string {
    return this.globalService.getImagePath(this.item()?.id + "/" + this.selectedImage()?.path)
  }

}
