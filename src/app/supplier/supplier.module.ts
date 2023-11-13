import { NgModule } from '@angular/core';
import { SupplierRoutingModule }   from './supplier.routing.module';

import { ReactiveFormsModule }     from '@angular/forms'
import { NgbModule }               from '@ng-bootstrap/ng-bootstrap'
import { CommonModule }            from '@angular/common'

import  {SupplierComponent}         from './pages/product.component'
import  {AddproductComponent}       from './pages/addproducts/addproduct.component'
import  {CalendarComponent}         from './pages/calendar/calendar.component'

import  {Confirm}                   from './pages/calendar/modal/modal.component'
import  {ModallazyComponent}        from './pages/calendar/modalblock/modal.component'



import { NgxImageCompressService}   from "ngx-image-compress";
import { InfiniteScrollModule }     from "ngx-infinite-scroll";
import { ttIfDirective }            from './directive/responsive.directive';


import { LazyLoadImageModule }      from 'ng-lazyload-image';

import { SharedModule }             from "../shared/shared.module"

import { RemoveDatePipe, addheaderPipe, calculatePipe } from './pipe/supplier.pipe';

import { DragDropModule }           from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [SupplierComponent, AddproductComponent,ttIfDirective, CalendarComponent, Confirm, RemoveDatePipe, addheaderPipe, ModallazyComponent, calculatePipe],
  imports: [
    NgbModule,
    CommonModule,
    SupplierRoutingModule,
    SharedModule,
    LazyLoadImageModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    DragDropModule
  ],
  providers: [NgxImageCompressService],
})
export class SupplierModule { }
 