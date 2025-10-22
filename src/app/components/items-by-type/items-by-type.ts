import { Component, resource } from '@angular/core';

@Component({
  selector: 'app-items-by-type',
  imports: [],
  templateUrl: './items-by-type.html',
  styleUrl: './items-by-type.css'
})
export class ItemsByType {

  imagesLocation: string = "http://localhost:8080/"

  items = resource({
    loader: async () => {
      const result = await fetch(('https://localhost:7294/api/Item'))
      return result.json();
    }
  })

  path() {
    return this.imagesLocation + "default.jpg"
  }

}
