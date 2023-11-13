import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from "@angular/core";
import { LiWrapperComponent } from "../liwrapper/liwrapper.component";
import { Observable, map, of, tap } from "rxjs";

@Component({
  selector: "ul-wrapper",
  template: `
    <ng-container *ngFor="let cst of list$ | async">

    <ul
    class     = "list-group "
    [ngStyle] = "{ width: getwidth, top:gettop, left : getleft, transform: gettranslatex }"
    style     = "position: absolute; z-index: 4;"
     >

    <ng-container *ngIf="getdata?.loading && cst.type === 'loading'">

     <ng-container *ngTemplateOutlet="cst.rowTemplate">
     </ng-container>

    </ng-container>

    <ng-container *ngIf="getdata?.load  &&  cst.type === 'load'">
      
     <ng-container *ngFor="let row of getdata?.value; let i = index">
     <ng-container *ngTemplateOutlet="cst.rowTemplate; context: { $implicit: row, index : i }"></ng-container>
     </ng-container>

   </ng-container>

   <ng-container *ngIf="getdata?.load && getdata?.value.length === 0 && cst.type === 'notfound'">
    <ng-container *ngTemplateOutlet="cst.rowTemplate"></ng-container>
   </ng-container>
    


   </ul>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UlWrapperComponent {
  public data : any;
  public width: any;
  public top  : any;

  public left        : any;
  public translatex  : any;

  // left: 50%; transform: translatex(-50%);

  @Input("left")
  set setleft(res: any) {
  this.left = res
  }
  get getleft() {
  return this.left
  }

  @Input("translatex")
  set settranslatex(res: any) {
  this.translatex = res
  }
  get gettranslatex() {
  return this.translatex
  }


  @Input("data")
  set setdata(res: any) {
  this.data = res
  }
  get getdata() {
  return this.data;
  }

  @Input("width")
  set setwidth(res: any) {
  if (res) {
  this.width = res
  }
  }
  get getwidth() {
  return this.width
  }

  
  @Input("top")
  set settop(res: any) {
  if (res) {
  this.top = res
  }
  }
  get gettop() {
  return this.top
  }



  public list$: Observable<any> | undefined | any;

  @ContentChildren(LiWrapperComponent) customRowDefinitions:| QueryList<LiWrapperComponent>| undefined
| any;

  ngAfterViewInit() {
         
    this.list$ = of(this.customRowDefinitions.toArray())

    //this.list$ = this.customRowDefinitions.changes.pipe(
    //tap((res: any) =>{
    //console.log(res.toArray())
    //}),
    //map((res: any) => res.toArray())
    //);
    
  }

  // getKeys(res:any){
  //  return  Object.keys(res)[0]
  // }
  
  ngOnDestroy(){
  
  }
}
