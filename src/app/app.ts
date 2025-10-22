import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './service/auth-service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,Navbar,MatSidenavContent,MatSidenavModule,MatSidenavContainer,MatButton,MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  authService = inject(AuthService)

}
