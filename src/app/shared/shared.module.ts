import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import {
navComponent,
TitleNav,
FormNav,
MenuNav
} 
from "./presentation/nav/nav.component";

import {
panelComponent, 
contentleftPanel, 
contentrightPanel 
} 
from "./presentation/panel/panel.component";

import { 
cardComponent,
cardHeader,
cardBody,
cardFooter
}      
from "./presentation/card/card.component";

import { SkeletonComponent }  from "./complex/skeleton/skeleton.component";

import { loadingComponent }   from "./complex/loadingicon/loading.component";

import { offCanvasComponent } from "./complex/offcanvas/offcanvas.component";

import { sidebarComponent }   from "./complex/sidebar/sidebar.component";



import { TableComponent, tableDataDirective, tableLoadDirective, tableHeadDirective  }    from "./complex/table/table.component";



import { ttIfDirective }      from "./directive/responsive.directive";

import { LiWrapperComponent } from "./complex/ul/liwrapper/liwrapper.component";
import { UlWrapperComponent } from "./complex/ul/ulwrapper/ulwrapper.component";


import { WithLoadingPipe, SearchLoadingPipe }  from './pipe/loading.pipe';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  declarations: [

    navComponent,
    TitleNav,
    FormNav,
    MenuNav,
    // TitleNavDirective,
    // FormNavDirective,
    // MenuNavirective,

    panelComponent,
    contentleftPanel,
    contentrightPanel,


    LiWrapperComponent,
    UlWrapperComponent,
    offCanvasComponent,
    SkeletonComponent,
  
    cardComponent,
    cardFooter,
    cardHeader,
    cardBody,

    TableComponent,
    tableDataDirective, 
    tableLoadDirective,
    tableHeadDirective,
    
    loadingComponent,
    sidebarComponent,
    ttIfDirective,
    WithLoadingPipe, 
    SearchLoadingPipe 
  ],
  exports: [
    UlWrapperComponent,
    LiWrapperComponent,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    offCanvasComponent,

    navComponent,
    TitleNav,
    FormNav,
    MenuNav,


    

    panelComponent,
    contentleftPanel,
    contentrightPanel,

    SkeletonComponent,
    loadingComponent,
    sidebarComponent,

    WithLoadingPipe, 
    SearchLoadingPipe ,


    cardComponent,
    cardFooter,
    cardHeader,
    cardBody,

    TableComponent,
    tableDataDirective, 
    tableLoadDirective,
    tableHeadDirective,

    

  ],
})
export class SharedModule {}
