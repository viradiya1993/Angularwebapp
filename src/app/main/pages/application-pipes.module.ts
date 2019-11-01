import { ToFixedAmountPipe } from 'app/to-fixed-amount.pipe';
import { NgModule } from '@angular/core';
import { HighlightSearchPipe } from 'app/highlight-search.pipe';
import { WordwrapPipe } from 'app/wordwrap.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    ToFixedAmountPipe,
    HighlightSearchPipe,
    WordwrapPipe
  ],
  exports: [
    ToFixedAmountPipe,
    HighlightSearchPipe,
    WordwrapPipe
  ]
})
export class ApplicationPipesModule {
}  
