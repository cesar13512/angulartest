import { NgModule }                 from '@angular/core';
import { ReactiveFormsModule }      from '@angular/forms';
import { RegisterComponent}         from './pages/register/register.component';
import { CommonModule }             from '@angular/common';
import { AuthRoutingModule }        from './auth.routing.module';



@NgModule({
  declarations: [RegisterComponent],
  imports: [
    AuthRoutingModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
})
export class AuthModule { }
 