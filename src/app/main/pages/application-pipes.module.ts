import { ToFixedAmountPipe } from 'app/to-fixed-amount.pipe';
import { NgModule } from '@angular/core';
import { HighlightSearchPipe } from 'app/highlight-search.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    ToFixedAmountPipe,
    HighlightSearchPipe
  ],
  exports: [
    ToFixedAmountPipe,
    HighlightSearchPipe
  ]
})
export class ApplicationPipesModule {
}  
