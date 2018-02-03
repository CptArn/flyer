
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculationComponent } from './calculation/calculation.component';

const routes: Routes = [
    {
        path: '',
        component: CalculationComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
