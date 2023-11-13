import { ChangeDetectionStrategy, Component, ContentChild, Input,  TemplateRef } from '@angular/core';

 
@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class offCanvasComponent {
  
  public dataref : any;

  @Input('data')
  set listdata(data:any){
  this.dataref = [...data]
  }
  get listdata(){
  return this.dataref
  }

  @ContentChild('list')       list : TemplateRef<any> | undefined | any;
  @ContentChild('header')   header : TemplateRef<any> | undefined | any;
  

}
 