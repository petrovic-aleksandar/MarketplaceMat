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
    return this.http.get<User>(this.api + id)
  }

  getAll() {
    return this.http.get<User[]>(this.api)
  }

  getRoles() {
    return this.http.get<string[]>(this.api + "roles")
  }

  add(u:UserReq) {
    const apiNoTrailing = this.api.substring(0, this.api.length - 1)
    return this.http.post(apiNoTrailing, u)
  }

  update(u:UserReq, id:number) {
    return this.http.post(this.api + id, u)
  }

  deactivate(id:number) {
    return this.http.post(this.api + "deactivate/" + id, null)
  }

  activate(id:number) {
    return this.http.post(this.api + "activate/" + id, null)
  }
  
}
