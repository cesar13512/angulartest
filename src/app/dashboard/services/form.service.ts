
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { BehaviorSubject, catchError, combineLatest, concatMap, map, merge,  of, scan,  shareReplay,  Subject, switchMap, tap, throwError} from 'rxjs';

import { ApiService } from 'src/app/core/models/services/api.service'; 

import { localStore } from 'src/app/core/models/services/jsonconvert.service'; 


@Injectable({
  providedIn: 'root',
})
export class FormService { 

    constructor(
    private apiservice   : ApiService,
    private localStore   : localStore
    ) {
    }



   
    public searchdata     : any = [];

    public productCrudActionSubject  = new Subject<any>()
    public productCrudActionStatus   = new Subject<any>()

    public countData$                = new BehaviorSubject<any>(0)
    
    public doestablepaginate         = false

    
    
    public spinner$                  = new BehaviorSubject(false)
    public lastlist$                 = new BehaviorSubject(false)

    public initquery                 = true




    public login$                    = new BehaviorSubject<any>({init:false,http:'', model: 'supplier'})


    public sortquery                 = [{"key": "id", "key1": "DESC"}] 
    public where                     : any = {};
    public searchquery               : any = ''
    
    
    public query$ =  this.login$.pipe(switchMap((login)  => {
    if(login.init){
    console.log("das")
    return this.getHttp(login.model,login.http,0,5).pipe(
    tap((x) => {
    this.initquery = !x.status
    this.countData$.next(x.totaldata) 
    }),
    map((i) => (i.data) ))
    }
    return of([])
    })
    
    )
    
    getHttp(model:any,http:any,offset:any,limit:any){
 
     const params = new HttpParams()
     .append('model'  , model)
     .append('sort'   , JSON.stringify(this.sortquery))
     .append('where'  , JSON.stringify(this.where))
     .append('search' , this.searchquery )
     .append('offset' , offset)
     .append('limit'  , limit)
    
     return this.apiservice.getRequest(http, params )
 

    }
    
      
  
    
    data$ = merge(
    this.query$,
    this.productCrudActionSubject.asObservable().pipe(
    concatMap((i:any) => {
    return this.postData(i)
    }),
    
    )
  
    ).pipe(
    scan((oldValue: any, action:any) => {
    
    if (Array.isArray(action)) {
    return action
    }

    if ( action.operation === 'SORT' || action.operation === 'SEARCH'  || action.operation === 'PAGINATE' ) {
    return action.entity
    }

    if (action.operation === 'UPDATE') {
  
    oldValue[oldValue.findIndex((i:any) => i.id  === action.entity.id)].verifylast = true
    return oldValue
     
    }


    return [...oldValue];
        
    }),
    shareReplay(1),
    catchError((err) => {
    console.error(err)
    return throwError(err)
    })
   
    )
   


    postData(i:any){

     if(i.operation === 'UPDATE'){
    
      return this.apiservice.postRequest(i.http,i.entity).pipe(
      map(x  => ({ operation: i.operation , entity:x.data }) ),
      tap(x  =>  console.log(x) ),
      tap({
      next:  (postAction  => { this.productCrudActionStatus.next(postAction.operation) }),
      error: (()          => { this.productCrudActionStatus.next("ERROR")  }),
      }),
      catchError((err)    => (err) )
      )
      

     }

     if(i.operation === 'SORT'){ 
  

      if(i.entity === 'Email Approve')  { this.where  = {verifyfirst : 1} }

      if(i.entity === 'Status Approve') { this.where  = { verifylast : 1} }
      
      if(i.entity === 'Default'){ this.where  = {} }
      
      return this.getHttp(i.model,i.http,0,5).pipe(
      tap((x) => {
      this.initquery = x.status
      this.countData$.next(x.totaldata) 
      }),
      map((res) => ({ operation: i.operation, entity: res.data }) )
      )

      


     }

     if(i.operation === 'SEARCH'){ 

      this.searchquery = i.entity.search

      return this.getHttp(i.model,i.http,0,5).pipe(
      tap((x) => {
      this.countData$.next(x.totaldata)
      }), 
      map((res) => ({ operation: i.operation , entity: res.data }) )
      )
  
     }


     if (i.operation === 'PAGINATE') {

      return this.getHttp(i.model,i.http,Number((i.entity - 1)*5) ,5).pipe( 
      map((res) => ({ operation: i.operation , entity: res.data }) )
      )
    
     }

     if (i.operation === 'CLEAR') {
     
      return of({ operation: i.operation  })
 
  
     }

  
     return of(i);  

    }
    


    
    update(post: any) {
    this.productCrudActionSubject.next({operation: 'UPDATE', http:post.http, entity: post.value})
    }


    search(post: any) {
    this.productCrudActionSubject.next({operation: 'SEARCH', http:post.http, entity: post.value, model:post.model})
    }

    
    sort(post: any) {
    this.productCrudActionSubject.next({operation: 'SORT',   http:post.http,  entity: post.value , model: post.model})
    }

    paginate(post: any) { 
    this.productCrudActionSubject.next({operation: 'PAGINATE', http:post.http, entity: post.value, model:post.model})
    }


 


    



   


    
}
 


