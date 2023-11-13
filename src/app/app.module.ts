import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from "./shared/shared.module";

import { CoreModule } from './core/models/core.module';

import { AuthGuardService   } from './auth.guard';
import { CurrentUserService } from './useractivate.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), 
    AppRoutingModule,
  ],
  providers: [CurrentUserService,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
