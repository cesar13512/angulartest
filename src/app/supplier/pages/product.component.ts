import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewRef, inject }     from '@angular/core';
import { FormService }  from './../services/form.service'
import { Router,  NavigationStart, Event as NavigationEvent, NavigationEnd  }       from '@angular/router';
import { FormBuilder }  from '@angular/forms';
import { ApiService }   from 'src/app/core/models/services/api.service';
import { BehaviorSubject, Observable,  Subject,  combineLatest, concat, concatMap, debounceTime, distinctUntilChanged, filter, map, merge, mergeWith, of,  scan,  switchMap,  takeUntil,  tap } from 'rxjs';
import { HttpParams }   from '@angular/common/http';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CurrentUserService } from 'src/app/useractivate.service';


function onDestroy() {

  const destroy$ = new Subject<void>();
  const viewRef  = inject(ChangeDetectorRef) as ViewRef;

  viewRef.onDestroy(() => {
  destroy$.next()
  destroy$.complete()
  })

  return destroy$

}



@Component({
selector        : 'app-admin',
templateUrl     : './product.component.html',
changeDetection : ChangeDetectionStrategy.OnPush,
styleUrls       : ['./product.component.css']

})
export class SupplierComponent  {


  public user         : any
  public searchgroup  : any
  public searchlist$  : Observable<any> | undefined  | any

  public routeindex$         = new BehaviorSubject<any>('')

  private formService        = inject(FormService)
  private formBuilder        = inject(FormBuilder)
  private apiservice         = inject(ApiService)
  private router             = inject(Router)
  private offcanvasService   = inject(NgbOffcanvas)
  private currentUser        = inject(CurrentUserService)
  public  destroy$           = onDestroy()

  

    
  public  shareuser   = this.currentUser.currentUser$.asObservable()

  public route$   = of(
  [ 
   {link : 'addproduct', title : 'Add Employee', active: false, class : 'bi bi-house-dash-fill me-2' },
   {link : 'calendar',   title : 'Add Schedule', active: false, class : 'bi-calendar me-2'}
  ]
  )
  .pipe(
   mergeWith(this.routeindex$.asObservable())
   )
  .pipe(
  scan((acc, action)  => {
   
   if (action) {

    acc.map((i:any)=>{ i.active = false })
    let index = acc.findIndex((i:any)=> i.link === action)
    acc[Math.max(index, 0)].active = true
       
    return acc
    
   }

  })
  )
  
  public routeactive  =  this.router.events.pipe(
  filter( (event:any) => event instanceof NavigationEnd),
  tap((event:any)=>{
        
   let newText  = event.urlAfterRedirects.replace('/supplierpage/home/', '')
    
   let position = newText.search(/\?/g)
      
   if(position > 0){
   let result   = newText.slice(position, newText.length)
   let newText2 = newText.replace(result, '')
   this.routeindex$.next(newText2)
    
   }
   if(position < 0){
   this.routeindex$.next(newText)
   }
      
  }),
  takeUntil(this.destroy$),
  ).subscribe()
     




 

  

  public finish       = false 
  public next$        = new BehaviorSubject<any>(false)

  ngOnInit() {


   this.searchgroup  = this.formBuilder.group({
   search            : [''],
   })



   
   this.searchlist$  = combineLatest([
   this.searchgroup.controls.search.valueChanges.pipe(
   distinctUntilChanged(),
   map((value:any)=>{
   if(this.finish){
   return {refresh :true,search:value}
   }
   else{
   return {refresh:false,search:value}
   }
   }),
   tap((res:any)=>{
   if(res.refresh){
   this.next$.next(false)
   this.finish = false
   } 
   })),
   this.next$.asObservable(),
   this.shareuser
   ]).pipe(
   debounceTime(500), //emit latest value good for 2 observable emit simultaneosly
   concatMap(([res, cond, user] : any ) : any=> {


    if(!cond && res.search && !res.refresh){ 
 
    const params = new HttpParams()
    .append('id'         , user.id)
    .append('sort'       , JSON.stringify([{"key": "id", "key1": "DESC"}]))
    .append('where'      , JSON.stringify({}))
    .append('search'     , res.search )
    .append('cutoffdate' , user.cutoffdate)
    .append('offset'     , 0)
    .append('limit'      , 10)
      
    return concat(
    of({loading:true}),
    this.apiservice.getRequest('quatation/find', params ).pipe(map((i:any)=> (i.data)))
    )
          
    }
      
    if(!cond && !res.search  && !res.refresh){ 
    return of({loading: false}) 
    }
         
    if(!cond && res.search  && res.refresh){
    return of({loading: false}) 
    }
 
    if(!cond && !res.search  && res.refresh){
    return of({loading: false}) 
    }
     
    if(cond){
    return of({loading: false}) 
    }
 
   })
   )

   this.formService.reloadobs$.asObservable().pipe(
   takeUntil(this.destroy$),
   tap((x:any) =>{
   if(x){ this.searchgroup.get('search').setValue('') }
   })
   ).subscribe()
   

   } 

  logout(){


   this.formService.login$.next({init:false,http:''});
   this.router.navigate([''])
   localStorage.removeItem('user')
   

    
  }
  
  searchClick(res:any){

   this.router.navigate(['supplierpage/home/newly'], { queryParams: { search: res } })
   this.finish = true
   this.searchgroup.get('search').setValue(res) 
  
  }

  searchClick2(res:any){

    this.router.navigate(['supplierpage/home/newly'], { queryParams: { search: res } })
    this.finish = true
    this.next$.next(true)
 
   }
 

  openRoute(route:any,i:any){

    this.router.navigate([`supplierpage/home/${route}`])
    this.offcanvasService.dismiss()
     
  }




  open(content:any) {
 	this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title', panelClass: 'w-75'})
	}


  


}
 