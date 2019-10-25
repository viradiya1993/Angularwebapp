import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toFixedAmount' })
export class ToFixedAmountPipe implements PipeTransform {

  transform(value: any, args: any = 2): any {
    if (args) {
      return '$ ' + Number(value).toFixed(2);
    }
    else
      return value;
  }

}
