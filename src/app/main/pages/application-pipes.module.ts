import { ToFixedAmountPipe } from 'app/to-fixed-amount.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    ToFixedAmountPipe
  ],
  exports: [
    ToFixedAmountPipe
  ]
})
export class ApplicationPipesModule {
}  
