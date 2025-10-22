import { Component, inject, OnInit, resource } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { GlobalService } from '../../service/global-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemType } from '../../model/item-type';
import { MatAnchor } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-items-by-type',
  imports: [MatGridList, MatGridTile, MatAnchor, RouterLink, MatIcon],
  templateUrl: './items-by-type.html',
  styleUrl: './items-by-type.css'
})
export class ItemsByType {

  globalService = inject(GlobalService)

  type: ItemType | null = null
  typeId: number | null = null

  constructor(route: ActivatedRoute) {
    var id = route.snapshot.paramMap.get('id')
    console.log(id)
    this.typeId = Number(id)
    this.items.reload()
  }

  items = resource({
    loader: async () => {
      const result = await fetch(('https://localhost:7294/api/Item/byTypeId/' + this.typeId))
      return result.json();
    }
  })

  path(path:string):string {
    return this.globalService.getImagePath(path)
  }

  defaultPath() {
    return this.globalService.getImagePath("default.jpg")
  }

}
