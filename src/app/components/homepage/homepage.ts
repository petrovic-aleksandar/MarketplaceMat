import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemTypes } from "../item-types/item-types";

@Component({
  selector: 'app-homepage',
  imports: [RouterLink, ItemTypes, ItemTypes],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

}
