import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlightSearch'
})
export class HighlightSearchPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any, args?: any): any {
    if (!args || !value) {
      return value;
    }
    // Match in a case insensitive maneer
    const re = new RegExp(args, 'gi');
    if (value.match(re) && value) {
      const match = value.match(re);
      if (!match) {
        return value;
      }
      const replacedValue = value.replace(re, "<mark>" + match[0] + "</mark>")
      return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
    } else {
      return value;
    }
  }

}