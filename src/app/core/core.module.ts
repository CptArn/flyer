import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, Edit, Grid } from '@syncfusion/ej2-ng-grids';

@NgModule({
  declarations: [],
  imports: [ CommonModule, GridModule ],
  exports: [ GridModule ],
  providers: [],
})
export class CoreModule {

}

Grid.Inject(Edit);
