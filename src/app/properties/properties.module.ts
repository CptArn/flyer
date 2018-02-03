import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { PropertiesComponent } from './properties.component';

@NgModule({
  declarations: [
    PropertiesComponent
  ],
  imports: [
    CommonModule,
    CoreModule
   ],
  exports: [
    PropertiesComponent
  ],
  providers: [],
})
export class PropertiesModule {}
