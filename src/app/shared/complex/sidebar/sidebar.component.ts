import { ChangeDetectionStrategy, Component, ContentChild, Input,  TemplateRef } from '@angular/core';

 
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush,
  

})
export class sidebarComponent {
  
  public dataref : any

  @Input('data')
  set listdata(res:any){
  this.dataref = [...res]
  }
  get listdata(){
  return this.dataref
  }

  @ContentChild('list')       list : TemplateRef<any> | undefined | any
  @ContentChild('header')   header : TemplateRef<any> | undefined | any
  

}
 