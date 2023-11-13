
import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';
 
@Directive({ 
  selector: '[ttIf]' 
})
export class ttIfDirective  {
 
  _ttif : any;

 
 
  constructor(private _viewContainer: ViewContainerRef,
            private templateRef: TemplateRef<any>) {
  }
 
 removelistener: any ;
 
  @Input()
  set ttIf(condition:any) {  

    this._ttif = condition

    this._updateView();
    
    if(this.removelistener){
    this.removelistener()
    }
   

  }

  _updateView() {
    
    const handleDeviceChange = (e:any) => {
    if (e.matches) {
    this._viewContainer.createEmbeddedView(this.templateRef)

    }
    else{
    this._viewContainer.clear()
    }
    }
       
    const detection = window.matchMedia(`${this._ttif}`);
    detection.addEventListener('change',handleDeviceChange)

    handleDeviceChange(detection);

    this.removelistener = () => detection.removeEventListener('change',handleDeviceChange);



  }
 
}
 