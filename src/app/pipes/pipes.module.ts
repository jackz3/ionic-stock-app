import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

import { PriceDiff } from './price-diff'

@NgModule({
  declarations: [PriceDiff],
  imports: [
    CommonModule
  ],
  exports: [PriceDiff]
})
export class PipesModule { }
