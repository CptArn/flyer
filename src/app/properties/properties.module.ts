import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { PropertiesComponent } from './properties.component';
import { PropertiesService } from './properties.service';

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
  providers: [
    PropertiesService
  ],
})
export class PropertiesModule {}
