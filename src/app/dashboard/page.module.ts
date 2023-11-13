import { NgModule } from '@angular/core';
import { PageRoutingModule } from './page.routing.module';
import { FormsModule } from '@angular/forms';     
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule }     from '@angular/common';

import { landingDashboard }     from './pages/landing/landing.component';
import { ListsupplierComponent }     from './pages/listofsuppliers/listsupplier.component';
import { ListmemberComponent }     from './pages/listofmember/listsmember.component';

import { AdminComponent }     from './pages/admin.component';


import { NgChartsModule }         from 'ng2-charts';


@NgModule({
  declarations: [landingDashboard,ListsupplierComponent,ListmemberComponent,AdminComponent],
  imports: [
    CommonModule,
    PageRoutingModule,
    NgChartsModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule     
  ],
  providers: []
})
export class PageModule { }
 