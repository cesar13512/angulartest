

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
selector        : 'app-load',
templateUrl     : './loading.component.html',
changeDetection :  ChangeDetectionStrategy.OnPush,
})

export class loadingComponent  {

  private subject$ = new Subject<string>()

  public obs$      = new Subject<void>()

  @Input('cond')
  set ttIf(condition: boolean | undefined | any) {
  this.subject$.next(condition);  
  }

  //static:true will resolves ViewChild before any change detection is run.
  //static:false will resolves it after every change detection run.
  //Now, change the static: false. Now the code will work correctly. I.e because after every change detection the Angular updates the ViewChild.
  
  @ViewChild('viewContainer', { read: ViewContainerRef, static: true }) viewContainer: ViewContainerRef | any;

  @ViewChild('loading', { read: TemplateRef, static: true }) loading: TemplateRef<any> | any;

  constructor() {
  }


 
  ngOnInit() {

   this.subject$.pipe(
   takeUntil(this.obs$),
   tap((res:any)=>{

   if(res){
   this.viewContainer.createEmbeddedView(this.loading);
   }
   else{
   this.viewContainer.clear();
   }
      
   })
   ).subscribe()
    
   
    
  }
 
  
  ngOnDestroy(): void {

   this.obs$.next()
   this.obs$.complete()

  }
  

  


}
 