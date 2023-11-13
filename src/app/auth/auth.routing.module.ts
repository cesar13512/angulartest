import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { RegisterComponent }  from './pages/register/register.component';
import { LoginComponent }  from './pages/login/login.component';
import { retrieveCpmponent }  from './pages/retrievepassword/retrive.component';


const routes: Routes = [
 { path : '', redirectTo : 'login', pathMatch: 'full' },
 { path : 'register', component : RegisterComponent},
 { path : 'login',    component : LoginComponent},
 { path : 'retrieve',    component : retrieveCpmponent},

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
 