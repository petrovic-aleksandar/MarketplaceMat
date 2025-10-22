import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { User } from '../model/user';
import { RegUser } from '../model/request/reg-user';
import { LoginUser } from '../model/request/login-user';
import { GlobalService } from './global-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http=inject(HttpClient)
  globalService = inject(GlobalService)

  private readonly api:string = this.globalService.getApi("Auth")
  
  loggedUser = signal<string>("")
  loggedUserId: number = 0
  loggedUserRole = signal<string>("")

  login(lu:LoginUser) {
    return this.http.post(this.api + "login", lu)
  }

  register(ru:RegUser) {
    return this.http.post(this.api + "register", ru)
  }

  readLoggedUserFromStorage() {
    const loggedUser = localStorage.getItem("loggedUser")
    if (loggedUser != null) {
      this.loggedUser.set(loggedUser)
      this.loggedUserId = Number(localStorage.getItem("loggedUserId"))
      const loggedUserRole = localStorage.getItem("loggedUserRole")
      if (loggedUserRole != null)
        this.loggedUserRole.set(loggedUserRole)
      else
        this.loggedUserRole.set("")
    } else {
      this.loggedUser.set("")
      this.loggedUserId = 0
      this.loggedUserRole.set("")
    }
    this.loggedUser.update
  }
  
}
