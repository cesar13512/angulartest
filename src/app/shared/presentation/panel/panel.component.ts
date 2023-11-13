

import { ChangeDetectionStrategy, Component, Directive} from '@angular/core';

@Directive({
selector: 'contentright-panel'
})
export class contentrightPanel {}
  
@Directive({
selector: 'contentleft-panel'
})     
export class contentleftPanel {}



@Component({
selector        : 'app-panel',
templateUrl     : './panel.component.html',
changeDetection : ChangeDetectionStrategy.OnPush
})

export class panelComponent  {

  constructor() {
  }

}
 