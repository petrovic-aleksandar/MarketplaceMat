import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css'
})
export class UserSettings implements OnInit {

  ngOnInit(): void {
    
  }

}
