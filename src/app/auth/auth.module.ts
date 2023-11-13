import { NgModule }                 from '@angular/core';
import { ReactiveFormsModule }      from '@angular/forms';
import { LoginComponent}            from './pages/login/login.component';
import { RegisterComponent}         from './pages/register/register.component';
import { retrieveCpmponent}         from './pages/retrievepassword/retrive.component';

import { CommonModule }             from '@angular/common';
import { AuthRoutingModule }        from './auth.routing.module';




@NgModule({
  declarations: [LoginComponent,RegisterComponent, retrieveCpmponent],
  imports: [
    AuthRoutingModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],  
})
export class AuthModule { }
 