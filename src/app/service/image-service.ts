import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalService } from './global-service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  globalService = inject(GlobalService)
  http = inject(HttpClient)

  getByItemId(itemId: number) {
    return this.http.get(this.globalService.getApi("Image") + itemId)
  }

  makeFront(itemId: number, imageId: number) {
    return this.http.post(this.globalService.getApi("Image") + "front/" + imageId, null)
  }

  delete(id: number) {
    return this.http.delete(this.globalService.getApi("Image") + id)
  }
  
}
