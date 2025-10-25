import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global-service';
import { ItemReq } from '../model/request/item-req';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  http = inject(HttpClient)
  globalService = inject(GlobalService)

  readonly api: string = this.globalService.getApi("Item")

  add(i: ItemReq) {
    return this.http.post(this.api, i)
  }

  update(id: number, i: ItemReq) {
    return this.http.put(this.api + id, i)
  }

  deactivate(id: number) {
    return this.http.put(this.api + "Deactivate/" + id, null)
  }

  activate(id: number) {
    return this.http.put(this.api + "Activate/" + id, null)
  }

  delete(id: number) {
    return this.http.put(this.api + "Delete/" + id, null)
  }

  getById(id: number) {
    return this.http.get(this.api + id);
  }

  getByUserId(sellerId: number) {
    return this.http.get(this.api + 'bySellerId/' + sellerId)
  }

  getByTypeId(typeId: number) {
    return this.http.get(this.api + 'byTypeId/' + typeId)
  }

  getTypes() {
    return this.http.get(this.api + "Types")
  }

}
