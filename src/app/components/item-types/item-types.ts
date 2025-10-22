import { Component, inject, resource } from '@angular/core';
import { GlobalService } from '../../service/global-service';

@Component({
  selector: 'app-item-types',
  imports: [],
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
