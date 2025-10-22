import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monetary'
})
export class MonetaryPipe implements PipeTransform {

  transform(value: number): string {
    return value + " eur";
  }

}
