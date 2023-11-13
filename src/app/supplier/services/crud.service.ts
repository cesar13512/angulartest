
import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, Subject, concatMap, distinctUntilChanged,  map,  concatWith,  mergeWith,  of,   scan,  shareReplay,  switchMap,  tap,  combineLatestWith } from 'rxjs';
import { ApiService } from 'src/app/core/models/services/api.service';

@Injectable({
providedIn: 'any'
})

export class CrudService { 

  private apiservice               = inject(ApiService)

  public productCrudActionSubject  = new Subject<any>()
  
  public productCrudActionStatus   = new Subject<any>()
  public countData$                = new BehaviorSubject<any>(0)

  public http$                     = new BehaviorSubject('')


  getHttp(http:any){      
  return this.apiservice.getRequest(http)
  }


  state$ = this.http$.asObservable()
  .pipe(switchMap((http:any)=>{
   return this.apiservice.getRequest(http).pipe(
   tap({
   next:  (x)  => this.countData$.next(x.meta.total),
   error: ()   => this.productCrudActionStatus.next("ERROR")
   }),
   map((i:any) => i.data)
   )
   })
   
   
  )
  .pipe(mergeWith(this.productCrudActionSubject.asObservable().pipe(concatMap((i:any) => this.handleAction(i) ))))
  .pipe(
   scan((acc: any, action:any) => this.handleMutation(acc,action) ),
   shareReplay(1)
   )

  public  productSelectedSubject    = new BehaviorSubject<any>({})
 
  selectedProduct$ = this.state$.pipe(combineLatestWith(this.productSelectedSubject.asObservable())
  ).pipe(
  distinctUntilChanged((curr:any, prev:any) => {
  return JSON.stringify(curr[1]) === JSON.stringify(prev[1])
  }),
  concatMap(([state, selectedProductId])  => {

   if (!selectedProductId.id) { 
   return of({id: 0})
   }
   else{
   let found = state.find((product:any) => product.id == Number(selectedProductId.id))
   return of(found)
   }

  }),
  shareReplay(1),
  );  


  update(post: any) {
   this.productCrudActionSubject.next({operation: 'UPDATE', http:post.http, entity: post.value})
  }
  
  save(post: any) {
   this.productCrudActionSubject.next({operation: 'ADD', http:post.http, entity: post.value})
  }

  delete(post: any) {
   this.productCrudActionSubject.next({operation: 'DELETE', http:post.http, entity: post.value})
  }

  paginate(post: any) { 
   this.productCrudActionSubject.next({operation: 'PAGINATE', http:post.http, entity: post.value})
  }

  selectProduct(selectedProductId: any): any { 
    
    this.productSelectedSubject.next(selectedProductId)

  }




   handleAction(action:any){

    switch (action.operation) {
      
      case 'ADD':

      return this.apiservice.postRequest(action.http,action.entity).pipe( 
      tap({
      next  : (postAction) => { 
      this.productCrudActionStatus.next(action.operation) 
      this.countData$.next(postAction.totaldata) 
      },
      error : (res) => { 
      this.productCrudActionStatus.next(res.status) 
      }, 
      }),
      map((x)  => ({ operation: action.operation , entity:x.data }) )   
    
      )
       

      case 'PAGINATE':

      const params = new HttpParams().append('page', action.entity)
      return of({ operation: 'INITIAL' , entity: {loading:true} }).pipe(
      concatWith(
      this.apiservice.getRequest(action.http, params).pipe(
      tap({
      error : () => this.productCrudActionStatus.next("ERROR")
      }),
      map((res)  => ({ operation: action.operation , entity: res.data }) )
      )
      )
      )
     
      case 'UPDATE':
      //una si add editable$ changde due to productaction and after that state 2 changges 
      //occur in $product
      return this.apiservice.putRequest(action.http,action.entity.id,action.entity).pipe(
      tap({
      next  : () => { this.productCrudActionStatus.next(action.operation) },
      error : () => { this.productCrudActionStatus.next("ERROR")          }, 
      }),
      map(() => ({ operation: action.operation , entity: action.entity }) )
      )
      
      case 'DELETE':

      return of({ operation: 'INITIAL' , entity: {loading:true} }).pipe(
      concatWith(

       this.apiservice.deleteRequest(action.http,action.entity).pipe(switchMap((x  =>  
       this.getHttp(action.http).pipe(
       tap( (res)  =>  this.countData$.next(res.meta.total)               ),
       map( (res)  => ({ operation: action.operation , entity:res.data})  ),
       tap({
       next  : (postAction) => { this.productCrudActionStatus.next(postAction.operation) },
       error : ()           => { this.productCrudActionStatus.next("ERROR")  }, 
       })
       )          
       )),
       tap({
       error: ()  => { this.productCrudActionStatus.next("ERROR")  }
       }),
       )

       )
           
      )
       
       
      default:
      return of(action);
    }



  }
  

 




  

 private handleMutation(state: any, action: any) : any{
  
    if (Array.isArray(action)) {

      if(action.length > 0){
      state = action
      return state
      }
      else{
      state = [] 
      return state
      }
   
    }

    switch (action.operation) {

     case 'ADD': 
     const newArray = [action.entity].concat(state);
     return newArray.slice(0, 5);

     
     case 'SCROLL': 
     return [...state, ...action.entity];
  
     
     case 'UPDATE': 
     const mewUpdate = [...state];
     mewUpdate[mewUpdate.findIndex((item: any) => item.id === action.entity.id)] = action.entity;
     return mewUpdate;
   
     
     case 'DELETE': 
     case 'PAGINATE': 
     return action.entity;

     case 'INITIAL': 
     return action.entity;

     
     default:
     return state;
     
    }
  }
    
  }



