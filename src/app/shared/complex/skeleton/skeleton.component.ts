

import { ChangeDetectionStrategy, Component,  ContentChild,  Input, TemplateRef } from '@angular/core';

@Component({
selector        : 'app-skeleton',
templateUrl     : './skeleton.component.html',
changeDetection : ChangeDetectionStrategy.OnPush,
styles          : ['.shimmer { color: grey; display:inline-block; -webkit-mask:linear-gradient(-60deg,#000 30%,#0005,#000 70%) right/300% 100%; background-repeat: no-repeat; animation: shimmer 1.5s infinite; } @keyframes shimmer { 100% {-webkit-mask-position:left} } '],
})
export class SkeletonComponent  {


  public width  : any;
  public height : any;

  @Input('width')
  set setwidth(res:any){
  this.width = res
  }
  get getwidth(){
  return this.width
  }

  @Input('height')
  set setheight(res:any){
  this.height = res
  }
  get getheight(){
  return this.height
  }

  @ContentChild('skeletonbody')   skeletonbody   : TemplateRef<any> | undefined | any;
  @ContentChild('skeletonfooter') skeletonfooter : TemplateRef<any> | undefined | any;

  constructor(
   ) {
  }



}
 