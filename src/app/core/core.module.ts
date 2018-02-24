import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatListModule, MatDividerModule, MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule, Edit, Grid, Toolbar } from '@syncfusion/ej2-ng-grids';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GridModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatListModule,
    MatDividerModule,
    MatSliderModule,
    FormsModule,
    SharedModule,
    MatSlideToggleModule
  ],
  exports: [
    GridModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatListModule,
    MatDividerModule,
    MatSliderModule,
    FormsModule,
    MatSlideToggleModule
  ],
  providers: [],
})
export class CoreModule {

}

Grid.Inject(Edit, Toolbar);
