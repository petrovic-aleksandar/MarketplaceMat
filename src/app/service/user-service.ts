import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { GlobalService } from './global-service';
import { UserReq } from '../model/request/user-req';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient)
  globalService = inject(GlobalService)

  readonly api:string = this.globalService.getApi("User")

  getById(id: number) {
    return this.http.get(this.api + id)
  }

  getAll() {
    return this.http.get(this.api)
  }

  getRoles() {
    return this.http.get<string[]>(this.api + "roles")
  }

  add(u:UserReq) {
    return this.http.post(this.api, u)
  }

  update(u:UserReq, id:number) {
    return this.http.put(this.api + id, u)
  }

  deactivate(id:number) {
    return this.http.put(this.api + "deactivate/" + id, null)
  }

  activate(id:number) {
    return this.http.put(this.api + "activate/" + id, null)
  }
  
}
