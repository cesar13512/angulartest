

import { ChangeDetectionStrategy, Component,  ContentChild,  Directive,  EventEmitter,  Input, Output, TemplateRef, inject } from '@angular/core';

  
@Directive({
selector: '[tableData]'
})     
export class tableDataDirective{
}

  
@Directive({
selector: '[tableLoad]'
})     
export class tableLoadDirective{
}

  
@Directive({
selector: '[tableHead]'
})     
export class tableHeadDirective{
}
  

@Component({
selector        : 'app-table',
templateUrl     : './table.component.html',
changeDetection : ChangeDetectionStrategy.OnPush,
})
export class TableComponent  {

  public th : undefined | any = [];

  public tr : undefined | any = [];

  public loading  : any ;

  public paginate : any ;

  @Input('thdata')
  set setthdata(data:any){
  this.th = data
  }
  get getThdata(){
  return this.th
  }

  @Input('trdata')
  set settrdata(data:any){
  this.tr = data
  }
  get getTrdata(){
  return this.tr
  }

  
  @Input('display')
  set setdisplay(data:any){
  this.loading = data?.loading
  }
  get getdisplay(){
  return this.loading
  }

    
  @Input('paginate')
  set setpaginate(data:any){
  this.paginate = data
  }
  get getpaginate(){
  return this.paginate
  }


  @Output() pageChange = new EventEmitter<number>()

  @ContentChild(tableHeadDirective, { read: TemplateRef }) thead     : TemplateRef<any> | any;
  @ContentChild(tableDataDirective, { read: TemplateRef }) tbody     : TemplateRef<any> | any;
  @ContentChild(tableLoadDirective, { read: TemplateRef }) tbodyload : TemplateRef<any> | any;

  
  paginateList(res:any) {
    this.pageChange.emit(res)
  }

}
 