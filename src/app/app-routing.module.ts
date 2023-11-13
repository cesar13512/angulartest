import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './auth.guard';


const routes: Routes = [
  {path: "",              loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: "supplierpage",  loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule)},
  {path: "adminpage",     canLoad:[AuthGuardService], loadChildren: () => import('./dashboard/page.module').then(m => m.PageModule)},
  {path: "verification",  loadChildren: () => import('./verfication/verification.module').then(m => m.verificationModule)},
  {path: "admin",         loadChildren: () => import('./secretadmin/auth.module').then(m => m.AuthModule)},
  {path: "member",        loadChildren: () => import('./secretmember/auth.module').then(m => m.AuthModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
