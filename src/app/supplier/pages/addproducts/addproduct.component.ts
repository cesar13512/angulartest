
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BehaviorSubject,  concat,    filter, first, map, Observable, of, pipe, shareReplay, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment';

import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';





import { CrudService }        from '../../services/crud.service'
import { ValidationService }  from '../../services/validation.service'

import { ApiService } from 'src/app/core/models/services/api.service';
import { HttpParams } from '@angular/common/http';


function getparamData(): Observable<any> | any {

  return inject(ActivatedRoute).queryParamMap.pipe(
  switchMap((params: any) => {
  return of({ id: params.get('id') })
  }),
  shareReplay(1)
  )

}

function getformGroup(): any {

  return [
    {
      "label"     : "Bioid",
      "fieldname" : "bioid",
      "fieldtype" : "text",
      "grid"      : "col",
      "required"  : true,
      "async"     : true,
      "http"      : 'api/v1/employees'
    },
    {
      "label": "Name",
      "fieldname": "name",
      "fieldtype": "text",
      "grid": "col",
      "required": true
    },
    {
      "label": "Position",
      "fieldname": "position",
      "fieldtype": "text",
      "grid": "col",
      "required": true
    },
    {
      "label": "Rate",
      "fieldname": "rate",
      "fieldtype": "text",
      "grid": "col",
      "required": true,
      "pattern": /^-?\d*[.,]?\d{0,4}$/,
    },
    {
      "label": "Cola",
      "fieldname": "cola",
      "fieldtype": "text",
      "grid": "col",

    },
       
    {
      "label"       : "Department",
      "fieldname"   : "department",
      "grid"        : "col",
      "required"    : true,
      "select"      : true
     },

     {
      "label"       : "Subdepartment",
      "fieldname"   : "subdepartment",
      "grid"        : "col",
      "select"      : true
     },

     {
      "label"       : "Subsubdepartment",
      "fieldname"   : "subsubdepartment",
      "grid"        : "col",
      "select"      : true
     },

    {
      "label"       : "Dm",
      "fieldname"   : "dm",
      "fieldtype"   : "text",
      "required"    : true,
      "grid"        : "col"
    },
  ]

}



function submitButtonFunc(form: any) {

  return pipe(
  switchMap(() => {
  let counterror = 0
  Object.keys(form.controls).forEach(key => {
  if (
  form.get(key)?.errors?.required   ||
  form.get(key)?.errors?.pattern    ||
  form.get(key)?.errors?.duplicate  ||
  form.get(key)?.errors?.duplicate1
  ) {
  counterror++
  }
  })

  if (counterror === 0) {
  return of(false)
  }
  else {
  return of(true)
  }
  }),
  startWith(true)
  )

}

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
  selector        : 'app-addproduct',
  templateUrl     : './addproduct.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class AddproductComponent {

  public env = environment.url

  public supplierform: any
  
  public buttonaction$ = new BehaviorSubject<any>(false)

  public buttondisable$     : Observable<any> | undefined
  public department$        : Observable<any> | undefined
  public subdepartment$     : Observable<any> | undefined 
  public subsubdepartment$  : Observable<any> | undefined 

  public  paramshare   = getparamData()
  
  public  list$        = of(getformGroup())

  private formBuilder  = inject(FormBuilder)
  private router       = inject(Router)
  private toastr       = inject(ToastrService)
  public  modalService = inject(NgbModal)

  private apiservice   = inject(ApiService)
  private validationService = inject(ValidationService)
  private crudService  = inject(CrudService)

  public  destroy$     = onDestroy()


  public employee$    = this.crudService.state$

  public editable$    = this.crudService.selectedProduct$.pipe(
  tap((i) => {

  if (i.id) {
 
   const { department,subdepartment,subsubdepartment, ...json } = i;

   Object.keys(json).forEach((key) => {
   getformGroup().map((x: any) => {
   if (key === x.fieldname) {
   this.supplierform.get(x.fieldname).setValue(i[key])
   }})})

   this.supplierform.controls['bioid'].clearAsyncValidators()
   this.supplierform.get('bioid').updateValueAndValidity()

   this.department$?.pipe(filter(filter => filter[0]?.loading !== true),takeUntil(this.destroy$)).subscribe((department)=>{
   let find = department.find((y:any) => i.department === y.department )
   this.supplierform.get('department').setValue(find)
   })

   this.subdepartment$?.pipe(filter(filter => filter[0]?.loading !== true),takeUntil(this.destroy$)).subscribe((subdepartment)=>{
   let find = subdepartment.find((y:any) => i.subdepartment === y.subdepartment )
   this.supplierform.get('subdepartment').setValue(find)
   })

       
   this.subsubdepartment$?.pipe(filter(filter => filter[0]?.loading !== true),takeUntil(this.destroy$)).subscribe((subsubdepartment)=>{
   let find = subsubdepartment.find((y:any) => i.subsubdepartment === y.subsubdepartment )
   this.supplierform.get('subsubdepartment').setValue(find)
   })


  }
  }),
  shareReplay(1)
  )

  paginate$    = this.crudService.countData$.asObservable().pipe(
  filter(i =>  i!==0 ), 
  map   (i =>  ({ collectionSize: i , pageSize : Math.ceil(i/5)}) )
  )

    
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {


    this.crudService.http$.next('api/v1/employees')


    this.list$.pipe(takeUntil(this.destroy$)).subscribe((res)=>{

     let group: any    = {}
     res.forEach((x: any)  => { 
      
     const validators = []
     if (x.required) {
     validators.push(Validators.required)
     }
     if (x.pattern) {
     validators.push(Validators.pattern(x.pattern))
     }
     group[x.fieldname] = ['',validators]
    
     })
    
     this.supplierform   = this.formBuilder.group(group)
    
     this.supplierform.controls['bioid'].setAsyncValidators([this.validationService.findDuplicate('api/v1/employees')])
     this.supplierform.get('bioid').updateValueAndValidity()
    
     this.buttondisable$ = this.supplierform.valueChanges.pipe(submitButtonFunc(this.supplierform))
    
     this.department$    = this.apiservice.getRequest('api/v1/departments').pipe(
     map((i)=>{ return i.data }),
     startWith([{loading:true}]),
     shareReplay(1),
     ) 
    
     this.subdepartment$ = this.supplierform.get("department").valueChanges.pipe(switchMap((i:any)=>{
     const params = new HttpParams().append('department_id[eq]',i?.id)
     return concat(
     of([{loading:true}]),
     this.apiservice.getRequest('api/v1/subdepartments', new HttpParams().append('department_id[eq]',i?.id)).pipe(map((i)=>{
     return i.data
     }
     ))
     )
     }),
     shareReplay(1),
     ) 
       
      
     this.subsubdepartment$ = this.supplierform.get("subdepartment").valueChanges.pipe(switchMap((i:any)=>{
     const params = new HttpParams().append('subdepartment_id[eq]',i?.id)
     return concat(
     of([{loading:true}]),
     this.apiservice.getRequest('api/v1/subsubdepartments',params).pipe(map((i)=>{
     return i.data
     }
     ))
     )
     }),
     shareReplay(1),
     ) 
    
     })

     this.paramshare.pipe(
     takeUntil(this.destroy$)
     ).subscribe((res: any) => {
     this.crudService.selectProduct(res)
     })
   
  

     this.crudService.productCrudActionStatus.pipe(
     tap((toast) => {
      
     if (toast === 'UPDATE') {

     this.supplierform.reset()

     this.toastr.success('Success ', `Success ${toast} List`.toUpperCase())
     this.router.navigate([], { queryParams: { id: null }, queryParamsHandling: 'merge' })

     this.supplierform.controls['bioid'].setAsyncValidators([this.validationService.findDuplicate('api/v1/employees')])
     this.supplierform.get('bioid').updateValueAndValidity()
 
    }

     else if (toast === 'ADD') {
     this.toastr.success('Success ', `Success ${toast} List`.toUpperCase())
     }
    
    
     else if (toast === 'DELETE') {
     this.toastr.success('Success ', `Success ${toast} List`.toUpperCase())
     }
    
     else{
     this.toastr.error('Error ', `Status ${toast}`)
     }

     })
     ).subscribe()







  }


  onFormSubmit() {

    this.editable$?.pipe( 
    tap((i: any) => {

     this.buttonaction$.next(true)

     if (!i.id ) {

      let data = {...this.supplierform.value};
      data.department       = this.supplierform.value.department?.department;
      data.subdepartment    = this.supplierform.value.subdepartment?.subdepartment;
      data.subsubdepartment = this.supplierform.value.subsubdepartment?.subsubdepartment

      this.buttonaction$.next(false)

      this.crudService.save({
      http: 'api/v1/employees',
      value: data
      })

      this.clear()

     }
     if(i.id){
     
      this.buttonaction$.next(false)

      let data = {...this.supplierform.value};
      data.department       = this.supplierform.value.department?.department;
      data.subdepartment    = this.supplierform.value.subdepartment?.subdepartment;
      data.subsubdepartment = this.supplierform.value.subsubdepartment?.subsubdepartment
      
      this.crudService.update({
      http: 'api/v1/employees',
      value: {...i,...data}
      })
      
     }
    }),
    first(),
    ).subscribe()

  }







  clear() {

    this.supplierform.reset()

  }

  
  Edit(row:any){
    

   this.router.navigate(['supplierpage/home/addproduct'], { queryParams: { id: row.id} })
  

  }

  Delete(row:any){
    
    this.crudService.delete({
    http: 'api/v1/employees',
    value: row.id
    })

  }

  
  paginateList(page:any){

    this.crudService.paginate({http: 'api/v1/employees',   value : page})
    // this.whatpage$.next(page)
 
   
   
   }
  


  getData(res:any){
  
   let newres = [...res]
   
   newres.push({label:"Delete"})
   newres.push({label:"Edit"})
  
   return newres
  
  }

  ngAfterViewInit() {

   this.supplierform.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
   this.cdr.markForCheck()
   })
    
  }


}
