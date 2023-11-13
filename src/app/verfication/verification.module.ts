import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './verification.routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import {landingComponent}      from './pages/landing/landing.component';



@NgModule({
  declarations: [landingComponent],
  imports: [
  
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],

})
export class verificationModule { }
 