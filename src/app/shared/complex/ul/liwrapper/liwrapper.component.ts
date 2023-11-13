
import {  ChangeDetectionStrategy, Component,  ContentChild,  Input, TemplateRef,  } from '@angular/core';


@Component({
  selector        : 'li-wrapper',
  template        : '',
  changeDetection : ChangeDetectionStrategy.OnPush,
})
export class LiWrapperComponent {
  

  public type : any;
  
  @Input('type')
  set listdata(res:any){
  this.type = res
  }
  @ContentChild('temp') rowTemplate: TemplateRef<any> | undefined | any;

  ngAfterViewInit() {

  }


}
 