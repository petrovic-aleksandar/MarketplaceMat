import { inject, Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { HttpClient } from '@angular/common/http';
import { TransferReq } from '../model/request/transfer-req';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  globalService = inject(GlobalService)
  http = inject(HttpClient)

  getByUserId(userId: number) {
    return this.http.get(this.globalService.getApi("Transfer") + "byUserId/" + userId)
  }

  addPurchase(req: TransferReq) {
    return this.http.post(this.globalService.getApi("Transfer") + "purchase", req)
  }

  addPayment(req: TransferReq) {
    return this.http.post(this.globalService.getApi("Transfer") + "payment", req)
  }

  addWithdrawal(req: TransferReq) {
    return this.http.post(this.globalService.getApi("Transfer") + "withdrawal", req)
  }
  
}
