import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { CalculationComponent } from './calculation.component';

@NgModule({
  declarations: [ CalculationComponent ],
  imports: [ CommonModule, CoreModule ],
  exports: [],
  providers: [],
})
export class CalculationModule {}
