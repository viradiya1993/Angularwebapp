import { ToFixedAmountPipe } from 'app/to-fixed-amount.pipe';
import { NgModule } from '@angular/core';
import { HighlightSearchPipe } from 'app/highlight-search.pipe';
import { WordwrapPipe } from 'app/wordwrap.pipe';
import { InvoiceNumberPipe } from 'app/invoicenumber.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    ToFixedAmountPipe,
    HighlightSearchPipe,
    WordwrapPipe,
    InvoiceNumberPipe
  ],
  exports: [
    ToFixedAmountPipe,
    HighlightSearchPipe,
    WordwrapPipe,
    InvoiceNumberPipe
  ]
})
export class ApplicationPipesModule {
}  
