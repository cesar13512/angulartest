
import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AbstractControl, AsyncValidatorFn,  ValidationErrors} from '@angular/forms'
import { BehaviorSubject, Observable, Subject, catchError,  concatMap, distinctUntilChanged,  map,    mergeWith,  of,   scan,  shareReplay,  switchMap,  tap, throwError, timer } from 'rxjs';
import { ApiService } from 'src/app/core/models/services/api.service';


function calendarGenerate() {

  const date        = new Date();
  const year        = date.getFullYear();
  const month       = date.getMonth();
  const firstDay    = new Date(year, month, 1);
  const lastDay     = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let calendar = []
  let week     = []
  let inc      = 0
  let days     = ["SUNDAY","MONDAY",'TUESDAY',"WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]

  for (let i = 0; i < firstDay.getDay(); i++) {
  inc++
  week.push({})
  }

  for (let day = 1; day <= daysInMonth; day++) {  
  week.push({day:day,d:days[inc],schedule:[]})
  inc++
  if (week.length === 7) {
  inc  = 0
  calendar.push(week)
  week = []
  }
  }
  
  if (week.length < 7) {
  calendar.push(week)
  }

  return calendar.flat().filter(obj => Object.keys(obj).length > 0)
 
}

@Injectable()
export class InputService { 

  private apiservice               = inject(ApiService)

  public productCrudActionSubject  = new Subject<any>()
  public productCrudActionStatus   = new Subject<any>()

  public calendar                  = calendarGenerate()

  public spinner$                  = new BehaviorSubject(false)
  public countData$                = new BehaviorSubject<any>(0)


  public obs$           = new Subject<void>()
  public dumbdata       : any = []
  
  public query$ =  this.apiservice.getRequest('api/v1/employees?includeSchedules=true').pipe(
  tap({
  next  : (x:any) => {
  this.countData$.next(x.meta.total) 
  },
  error : () => { 
  this.productCrudActionStatus.next("ERROR") 
  },
  })
  )


  
  state$ = this.query$.pipe(tap((result:any)=> {
  

   this.dumbdata = result.data.map((employeeinfo:any)=>{
   let newdata = {...employeeinfo,...{ availdate : calendarGenerate(), maxhour15: 48, acchour: 0 } }
   if(newdata.schedules){
   newdata.schedules.forEach((i:any)=>{
   
    const d1 = new Date(i.ontime).getDate();
    let dayObj = newdata.availdate.find((d: { day: number; })=> d.day === d1);
    dayObj.schedule.push(i);

   });
   }
   return newdata
   })

   let fistarr   = [{...{name:'REQUIRED'},...{ availdate : calendarGenerate().map((i)=>{ return {...i,...{required:[]}}})}}]   
   this.dumbdata = fistarr.concat(this.dumbdata);  

  }), 
  map(()=>{
  
   return JSON.parse(JSON.stringify(this.dumbdata)).map((i:any)=> {
   const availdate = i.availdate.slice(0, 5)
   return {...i, availdate }
   })
    
  }))
  .pipe(mergeWith( 
  this.productCrudActionSubject.asObservable().pipe(concatMap((i) => this.handleAction(i) ), 
  tap((i) => this.sideEffect(i) )
  ),
  ))
  .pipe( 
  scan((acc: any, action:any) => this.handleMutation(acc,action) ),
  shareReplay(1),
  catchError((err) => {
  return throwError(err)
  })
  )


  save(post: any) {
  
   this.productCrudActionSubject.next({operation: 'ADD', entity: post.value, http : post.http})
  
  }

  paginate(post: any) {
  
   this.productCrudActionSubject.next({operation: 'PAGINATE', entity: post.value})
   
  }



  findDuplicate(http:string): AsyncValidatorFn    {

      
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

    const params = new HttpParams().append('bioid[eq]',control.value)
    return timer(500).pipe(
    distinctUntilChanged(),
    switchMap(() => {
    return this.apiservice.getRequest(http, params).pipe(
    map((i:any) => ({find : i.data.length === 0 ? false : true }) ),
    )
    })
    ) 
    }
    
   } 
   
   sideEffect(i:any){

    if(i.operation === 'ADD'){

     let dumbdata  = JSON.parse(JSON.stringify(this.dumbdata))
     let index     = this.dumbdata.findIndex((y:any) => y.id  === i.entity.id)

     dumbdata[index].availdate.map((x:any)=>{
     if(x.day === i.entity.key.day){
     x.schedule.push(i.entity.result)
     }
     })     

     this.dumbdata = dumbdata
   
    }



  }


  handleAction(action:any){

    switch (action.operation) {
      
     case 'ADD':

      let newentity = {
      result  :  action.entity.result,
      id      :  action.entity.id,
      key     :  action.entity.key
      }
   
      return of({ operation: action.operation , entity : newentity }) 
        
      
     case 'PAGINATE':
      
      return of({ operation: action.operation , entity: action.entity })
     

     default:
      return of(action)

    }
  
  }
  

   private handleMutation(state: any, action: any) : any{
    
     switch (action.operation) {

      case 'ADD':

       let statedata = JSON.parse(JSON.stringify(state))
       let index     = statedata.findIndex((i:any) => i.id  === action.entity.id)
    
       statedata[index].availdate.map((i:any)=>{
       if(i.day === action.entity.key.day){
       i.schedule.push(action.entity.result)
       }
       })     
       return statedata
      

      case 'PAGINATE': 

       const startIndex = (action.entity - 1) * 5
       const endIndex   = startIndex + 5
    
       return JSON.parse(JSON.stringify(this.dumbdata)).map((i:any)=> {
       const availdate = i.availdate.slice(startIndex, endIndex)
       return {...i, availdate }
       })
      

      default:
       return state;

     }

  


  }

}
