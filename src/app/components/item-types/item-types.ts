import { Component, inject, resource } from '@angular/core';
import { GlobalService } from '../../service/global-service';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-item-types',
  imports: [MatGridListModule, RouterLink, MatButtonModule],
  templateUrl: './item-types.html',
  styleUrl: './item-types.css'
})
export class ItemTypes {

  globalService = inject(GlobalService)

  itemTypes = resource({
    loader: async () => {
      const result = await fetch(this.globalService.getApi("Item") + 'Types')
      return result.json();
    }
  })

  pathById(path:string) {
    return this.globalService.getImagePath(path)
  } 

}
