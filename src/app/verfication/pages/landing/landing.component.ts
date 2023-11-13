import { Component} from '@angular/core';
import { ApiService } from '../../../core/models/services/api.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, delay, takeUntil, tap } from 'rxjs';


@Component({
  selector: 'app-verification',
  templateUrl: './landing.component.html',
})
export class landingComponent  {


  public spinner = true

  public body    : any 
  public content : any 

  public obs$             = new Subject<void>()
  
  
  constructor(
  private apiservice      : ApiService,
  private _Activatedroute : ActivatedRoute,
  private _router         : Router
    
  ) {
  }
  
  ngOnInit() {
   
    this._Activatedroute.paramMap.subscribe(params => { 
    console.log(params)
    this.apiservice.postRequest("account/verifyfirst",{id:params.get('id')}).pipe(
    takeUntil(this.obs$),
    tap(()          => { this.spinner = true   }),
    delay(1000),
    tap((res)          => { 
    
   
     if(res.status){

      this.spinner = false  

     }

    }),
    ).subscribe()


    })
    
   }
  
   back(){

    this._router.navigate([''])
   }

   

  ngOnDestroy() {
    this.obs$.next()
    this.obs$.complete()
  }


}
 