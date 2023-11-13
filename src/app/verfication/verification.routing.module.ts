import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { landingComponent } from './pages/landing/landing.component';

const routes: Routes = [
 { path : '', redirectTo : 'admin', pathMatch: 'full' },
 { path : 'admin/:id', component : landingComponent },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
 