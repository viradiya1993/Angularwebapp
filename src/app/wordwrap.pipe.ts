import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'environments/environment';

@Pipe({
  name: 'wordwrap'
})
export class WordwrapPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args) {
      return (value.length > environment.WORDLIMIT) ? value.substring(0, environment.WORDLIMIT - 1) + '...' : value;
    } else
      return value;
  }

}
