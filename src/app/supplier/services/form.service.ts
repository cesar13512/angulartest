
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, catchError, concat, concatMap, delay,  map, merge,  of, scan,  shareReplay,  Subject, switchMap, tap, throwError} from 'rxjs';

import { ApiService } from 'src/app/core/models/services/api.service'; 

import { localStore } from 'src/app/core/models/services/jsonconvert.service'; 
import { CurrentUserService } from 'src/app/useractivate.service';


@Injectable({
  providedIn: 'root',
})
export class FormService { 
  
    private currentUser   = inject(CurrentUserService)

    private apiservice    = inject(ApiService)


    public productCrudActionSubject  = new Subject<any>()
    public productCrudActionStatus   = new Subject<any>()

   


    public initquery                 = true

    public sortquery                 = [{"key": "id", "key1": "DESC"}] 
    public where                     : any = {};
    public searchquery               : any = ''
    
    public login$                    = new BehaviorSubject<any>({init:false, http:''})
    
    //cache
    public searchname$               = new BehaviorSubject<any>('')
    public spinner$                  = new BehaviorSubject(false)
    public lastlist$                 = new BehaviorSubject(false)
    public countData$                = new BehaviorSubject<any>(0)


    public reloadobs$                = new Subject<any>()

    public user : any = ''

    public  shareuser : any = this.currentUser.currentUser$.asObservable().pipe(
    ).subscribe((res:any) =>{
    this.user = res
    })
      


    
    public query$ =  this.login$.asObservable().pipe(
    switchMap(((login:any)  => {


    if(login.init){  

     return this.getHttp(login.http,0,10).pipe(
     tap({
     next  : (x) => {
     this.initquery = !x.status  
     this.countData$.next(x.totaldata) 
     },
     error : () => { 
     this.productCrudActionStatus.next("ERROR") 
     },

     }),
     map((i)=> { 
   
     return i.data
     
     })
     
     )

    }
    else{

     this.initquery   = true  
     this.searchquery = ''
     this.searchname$.next('')
     return of([])
    
    }

    })
    
    )
    )

        
   getHttp(http:any,offset:any,limit:any){
     
 
    const params = new HttpParams()
    .append('id'         , this.user.id)
    .append('cutoffdate' , this.user.cutoffdate)
    .append('sort'       , JSON.stringify(this.sortquery))
    .append('where'      , JSON.stringify(this.where))
    .append('search'     , this.searchquery )
    .append('offset'     , offset)
    .append('limit'      , limit)
     
    return this.apiservice.getRequest(http, params )
  
 
   }

  
    
    product$ = merge(
    this.query$,
    this.productCrudActionSubject.asObservable().pipe(
    concatMap((i:any) => this.postData(i)),
    ),
    )
    .pipe( 
    scan((acc: any, action:any) => this.modifyData(acc,action) ),
    shareReplay(1),
    catchError((err) => {
    return throwError(err)
    })
   
    )
   

    postData(i:any){


      if(i.operation === 'ADD'){

      return this.apiservice.postRequest(i.http,i.entity).pipe( 
      tap({
  
      next  : (postAction) => {
      this.productCrudActionStatus.next(i.operation) 
      this.countData$.next(postAction.totaldata) 
      },

      error : () => { 
      this.productCrudActionStatus.next("ERROR") 
      }, 
  
      }),
      map((x)  => {
     
      let data             = {...x.data,...{quatationprices:[]}}
      data.quatationprices.push(x.data2)

      return { operation: i.operation , entity:data }

      }),   
    
      )
     
     
     }

     if(i.operation === 'UPDATE'){

      if(i.entity.images){

       return this.apiservice.postRequest(i.http,i.entity).pipe(
       tap({
       next:  ()  => { this.productCrudActionStatus.next(i.operation) },
       error: ()  => { this.productCrudActionStatus.next("ERROR")     },
       }),
       map(() => ({ operation: i.operation , entity: i.entity  }) )
       )

      }
      else{

       return this.apiservice.postRequest(i.http,i.entity).pipe(
       tap({
       next  : () => { this.productCrudActionStatus.next(i.operation) },
       error : () => { this.productCrudActionStatus.next("ERROR")     }, 
       }),
       map(() => ({ operation: i.operation , entity: i.entity }) )
       )
       } 

      }

     
     if(i.operation === 'DELETE'){

      this.where         = {}
      this.searchquery   = ''

      return concat(
      of({ operation: 'INITIAL' , entity: {loading:true} }),
      this.apiservice.postRequest(i.http,i.entity).pipe(
      switchMap((x  =>  

      this.getHttp("quatation/find",0,10).pipe(
      tap( (res)  =>  this.countData$.next(res.totaldata)          ),
      map( (res)  => ({ operation: i.operation , entity:res.data}) ),
      tap({
      next  : (postAction) => { this.productCrudActionStatus.next(postAction.operation) },
      error : ()           => { this.productCrudActionStatus.next("ERROR")  }, 
      }))
        
      )),
      tap({
      error: ()  => { this.productCrudActionStatus.next("ERROR")  }
      }),
      )
      )
  
     }

     
    

     if(i.operation === 'SEARCH'){
     
      this.searchquery = i.entity.search
      
      return concat(
      of({ operation: 'INITIAL' , entity: {loading:true} }),
      this.getHttp(i.http,0,10).pipe(
      tap({
  
      next  : (x) => {
      this.countData$.next(x.totaldata)
      this.lastlist$.next(false)
      this.initquery  = false
      },
    
      error : () => { 
      this.productCrudActionStatus.next("ERROR") 
      }, 
      
      }),
      map((res) => ({ operation: i.operation , entity: res.data }) )
      )
      )

     }
 

  

     if(i.operation === 'PAGINATE'){
    
      return concat(
      of({ operation: 'INITIAL' , entity: {loading:true} }),
      this.getHttp(i.http,Number((i.entity - 1)*10),10).pipe(
      tap({
      next  : () => {
      this.initquery  = false
      },
      error : () => { 
      this.productCrudActionStatus.next("ERROR") 
      }, 
      }),
      map((res) => ({ operation: i.operation , entity: res.data }) )
      )
      )
   
     }

     if(i.operation === 'SCROLL'){
     
      return this.getHttp(i.http,i.entity,2).pipe(
      tap(() => { this.spinner$.next(true) }),
      delay(1500),
      tap(() => { this.spinner$.next(false) }),
      map((x)          => {  return {operation:'SCROLL',entity:x.data}  }),
      tap((i)          => {  i.entity.length === 0 ? this.lastlist$.next(true) :  this.lastlist$.next(false)}),
      catchError((err) => {  return err                                 })
      )
      
    
     }

     if(i.operation === 'LOADALL'){

      this.searchquery = ''
      return concat(
      of({ operation: 'INITIAL' , entity: {loading:true} }),
      this.getHttp(i.http,0,10).pipe(
      tap(()  =>  {   this.searchname$.next('')          }),
      tap((x)  => {   this.countData$.next(x.totaldata) }),
      map((x) =>  {  return {operation:i.operation,entity:x.data}  }),
      tap({
      error: ()  => { this.productCrudActionStatus.next("ERROR")  }
      })
      )
      )
    
     }

     
     if(i.operation === 'UPDATEDUPLICATE'){

      return this.apiservice.postRequest(i.http,i.entity).pipe( 
      tap({
      next  : (postAction) => {
      this.productCrudActionStatus.next(i.operation) 
      this.countData$.next(postAction.totaldata) 
      },

      error : () => { 
      this.productCrudActionStatus.next("ERROR") 
      }, 
  
      }),
      map((x)  => {
      let data               = {...i.entity}
      data.quatationprices   = []
      data.quatationprices.push(x.data)
      return { operation: i.operation , entity:data }
      }),   
    
      )
     
     
     }

  
  
  
     return of(i);  

    }
    

   



    search(post: any) {
      
      this.productCrudActionSubject.next({operation: 'SEARCH', http:post.http, entity: post.value})

    }

    

   private modifyData(state: any, action: any) : any{


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
  
      if (action.operation === 'ADD' || action.operation === 'UPDATEDUPLICATE'){ 
  
       let newArray = [action.entity].concat(state)
       state = newArray.slice(0,10)
       return state
      
      }
  
      if (action.operation === 'SCROLL'){ 
  
       return [...state,...action.entity]
    
      }
    
      if (action.operation === 'UPDATE') {
  
       state[state.findIndex((i:any) => i.id  === action.entity.id)] = action.entity
       return state
      
      }
  
  
      if (
      action.operation === 'SEARCH'   || 
      action.operation === 'PAGINATE' ||  
      action.operation === 'DELETE'   ||  
      action.operation === 'LOADALL'   ) {
       
       state =  action.entity
       return state
     
      }
      
      if (action.operation === 'INITIAL') {
      
       return action.entity
      
      }
      
      
      
    }

    
}
 


