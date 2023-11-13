

import { ChangeDetectionStrategy, Component,  Directive,  EventEmitter,  Input, Output,  } from '@angular/core';

  
@Directive({
selector: 'card-header'
})     
export class cardHeader {}

@Directive({
selector: 'card-body'
})     
export class cardBody {}

@Directive({
selector: 'card-footer'
})     
export class cardFooter {}


@Component({
selector        : 'app-card',
templateUrl     : './card.component.html',
changeDetection :  ChangeDetectionStrategy.OnPush,
})

export class cardComponent  {


  public width   : any


  @Input()  data        : undefined | any;
  @Output() dataEvent   = new EventEmitter<string>()

  @Input('width')
  set getwidth(res:any){
  this.width = res
  }
  get getwidth(){
  return this.width
  }

  constructor(
   ) {
  }


}
 