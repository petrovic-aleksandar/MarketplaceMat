import { inject, Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { HttpClient } from '@angular/common/http';
import { TransferReq } from '../model/request/transfer-req';
import { PurchaseReq } from '../model/request/purchase-req';
import { Transfer } from '../model/transfer';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  globalService = inject(GlobalService)
  http = inject(HttpClient)

  getByUserId(userId: number) {
    return this.http.get<Transfer[]>(this.globalService.getApi("Transfer") + "byUserId/" + userId)
  }

  addPurchase(req: PurchaseReq) {
    return this.http.post(this.globalService.getApi("Transfer") + "purchase", req)
  }

  addPayment(req: TransferReq) {
    return this.http.post(this.globalService.getApi("Transfer") + "payment", req)
  }

  addWithdrawal(req: TransferReq) {
    return this.http.post(this.globalService.getApi("Transfer") + "withdrawal", req)
  }
  
}
