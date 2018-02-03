import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatListModule, MatDividerModule, MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule, Edit, Grid } from '@syncfusion/ej2-ng-grids';
import { FormsModule } from '@angular/forms';


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
    FormsModule
  ],
  exports: [
    GridModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatListModule,
    MatDividerModule,
    MatSliderModule,
    FormsModule
  ],
  providers: [],
})
export class CoreModule {

}

Grid.Inject(Edit);
