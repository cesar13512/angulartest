import { ChangeDetectionStrategy, Component,  Directive,  EventEmitter,  Input, Output, TemplateRef, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CurrentUserService } from 'src/app/useractivate.service';


@Directive({
selector: 'title-nav'
})
export class TitleNav {}

@Directive({
selector: 'form-nav'
})     
export class FormNav {}

@Directive({
selector: 'menu-nav'
})     
export class MenuNav{}

@Component({
  selector        : 'app-nav',
  templateUrl     : './nav.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class navComponent {

    
  private currentUser   = inject(CurrentUserService)



  public user  : Observable<any> | undefined = this.currentUser.currentUser$.asObservable()
  
  public padding      : any 
  public isCollapsed  = true

  @Input()  template    : TemplateRef<any> | undefined | any;
  @Output() openEvent   = new EventEmitter<string>()
  @Output() logoutEvent = new EventEmitter<string>()



  @Input('padding')
  set setpadding(res:any){
  this.padding = res
  }
  get getpadding(){
  return this.padding
  }


  ngOnInit() {


  }

  
  open(){
  this.openEvent.emit(this.template)
  }

  logout(){
  this.logoutEvent.emit()
  }
   
}
 