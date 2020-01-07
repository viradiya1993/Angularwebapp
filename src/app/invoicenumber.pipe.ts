import { Pipe, PipeTransform } from '@angular/core';

/*
 * Usage:
 *   value | invoiceNumber
 * Example:
 *   {{ 'foo' | invoiceNumber }}
 *   formats to: '00000020'
*/
@Pipe({ name: 'invoiceNumber' })
export class InvoiceNumberPipe implements PipeTransform {
    transform(value: string, inMNumber: number = 8): string {
        if (value === '') {
            return '';
        }
        return value.toString().padStart(inMNumber, "0");
    }
}