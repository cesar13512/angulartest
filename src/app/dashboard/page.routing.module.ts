import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { landingDashboard }     from './pages/landing/landing.component';
import { ListsupplierComponent }     from './pages/listofsuppliers/listsupplier.component';
import { ListmemberComponent }     from './pages/listofmember/listsmember.component';

import { AdminComponent }     from './pages/admin.component';



const routes: Routes = [
  { path : '', redirectTo : 'home', pathMatch: 'full' },
  { path : 'home', component : AdminComponent ,
   children: [
   {
     path: 'list',
     component: ListsupplierComponent,
   },
   {
    path: 'dashboard',
    component: landingDashboard,
   },
   {
    path: 'member',
    component: ListmemberComponent,
   },


 ] },
 
 
  
 //  { path : 'register',              component : RegisterComponent},
 //  { path : 'dashboard',             component : DashboardComponent},
 //  { path : 'user',                  component : UserComponent},
 //  { path : 'rights',                component : RightsComponent},
 ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
 