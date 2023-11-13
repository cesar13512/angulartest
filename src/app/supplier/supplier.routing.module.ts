import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierComponent }      from './pages/product.component';

import { AddproductComponent } from './pages/addproducts/addproduct.component';

import { CalendarComponent } from './pages/calendar/calendar.component';



const routes: Routes = [
 { path : '', redirectTo : 'home', pathMatch: 'full' },
 { path : 'home', component : SupplierComponent ,
  children: [
  {
    path: 'addproduct',
    component: AddproductComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },



] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  SupplierRoutingModule { }
 