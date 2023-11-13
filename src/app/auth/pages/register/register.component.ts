
import { ChangeDetectionStrategy, Component,  OnDestroy, OnInit, inject } from '@angular/core';
import { ApiService }                   from '../../../core/models/services/api.service'; 
import { FormBuilder, Validators }      from '@angular/forms';
import { FormService }                  from './services/form.service'; 
import { ToastrService }                from 'ngx-toastr';
import { ActivatedRoute, Router }       from '@angular/router';

import { BehaviorSubject, combineLatest, iif, Observable, of, Subject, map, shareReplay, switchMap, takeUntil, tap, startWith, pipe, concatMap, delay  } from 'rxjs';
import { environment } from 'src/environments/environment';


function getFormdata() : Observable<any> | any { 


 let  formservice = inject(FormService)

 return inject(ActivatedRoute).queryParamMap.pipe(
 switchMap((params:any) => 
 iif(() => 
 params.get('header') === 'Supplier', 
 of({ header : 'Supplier', data : formservice.getSupplierForm() }), 
 of({ header : 'Member',   data : formservice.getMemberForm()   }) 
 )),
 shareReplay(1)
 )

} 

function initFunc(i:any):any{
 
 const group: any = {}
 i.map((x:any)  => { group[x.fieldname] = [''] })
 return group
 
}

function validationFunc(i:any,formservice:any):any{

  let obj : any = {validations : [] , asyncvalidations : []}
  
  i.map((x:any)  => { 
  let validations = [], asyncvalidations = []
  if(x.pattern){
  validations.push(Validators.pattern(x.pattern))
  }
  if(x.required){
  validations.push(Validators.required)
  }
  if(x.length){
  validations.push(formservice.phoneNumberlegth())
  }
  if(x.http){
  asyncvalidations.push(formservice.findDuplicate(x.http,x.fieldname))
  }
              
  if(asyncvalidations.length > 0){
  obj.asyncvalidations.push({fieldname:x.fieldname, validations : asyncvalidations})
  }
    
  if(validations.length > 0){
  obj.validations.push({fieldname:x.fieldname, validations : validations})
  }

  validations = [] 
  asyncvalidations = []
  
  })

  return obj


 
 }
 


 function submitButtonFunc(form:any){

  return pipe(
  map(([title,ret]:any) =>{
    
   let counterror = 0
  
   if(title === 'Supplier'){
  
    Object.keys(form.controls).forEach(key => {
    if(
    form.get(key)?.errors?.required     ||
    form.get(key)?.errors?.duplicate    ||
    form.get(key)?.errors?.length       ||
    form.get(key)?.errors?.pattern      ||
    form.get(key)?.errors?.maxLength    ||
    form?.errors?.match                 ||
    form.get(key)?.errors?.select  === false
    ){
    counterror++
    }
    }) 
        
   }
   else{
  
    Object.keys(form.controls).forEach(key => {
    if(
    form.get(key)?.errors?.required     ||
    form.get(key)?.errors?.duplicate    ||
    form.get(key)?.errors?.length       ||
    form.get(key)?.errors?.pattern      ||
    form?.errors?.match                 ||
    form.get(key)?.errors?.maxLength    
    ){
    counterror++
    }
    })
  
   }
  
   if(counterror === 0){
   return false
   }
   else{
   return true
   }
    
  
   }),
   startWith(true)
   )
  
 
 }
 
 function locationFunc(api:any){

  return api.getRequest("location").pipe(
  map((i:any) => { 
  let arr = []
  for (let key in i.data) { arr.push((i.data[key])) }    
  return arr
  }),
  shareReplay(1))
 
 }



 
 function provinceFunc(form:any) : Observable<any> | undefined | any {
  
  return pipe(
  tap(([val1, val2]) => {
  if(val1){
  form.get('province').setValue('') 
  }
  }),
  map((([val1, val2]) =>{
  if(val1){
  let key    = []
  let filter = val2.find((i:any)=> i.region_name === val1)
  for (let x in filter.province_list){ key.push(x) } 

  return key

  }
  return []

  })

  )
  )

 }

 function municipalityFunc(form:any) : Observable<any> | undefined | any{


  return pipe(
  tap(([val1, val2]) => {
  if(val1){
  form.get('municipality').setValue('') 
  }
  }),
  map((([val1, val2]) =>{

  if(val1){

  let region        = val2.find((i:any)=>  i.region_name === form.value.region )
  let municipality  = region.province_list[val1].municipality_list
  return municipality.map((i:any) => Object.keys(i)[0] )

  
  }
  return []
    

  }))
  )
      

 
 }
 
 function brgyFunc(form:any) : Observable<any> | undefined | any {

  return pipe(
  tap(([val1, val2]) => {
  if(val1){
  form.get('barangay').setValue('') 
  }
  }),
  map((([val1, val2]) =>{    
  
  if(val1){
      
  let region       = val2.find((i:any)=>  i.region_name === form.value.region )
  let municipality = region.province_list[form.value.province].municipality_list
  let brgy         
  
  municipality.map((i:any)=>{ if(i[val1]){ brgy =i[val1].barangay_list } })
    
  return brgy

  }
  return []

  })
  
  )  
  )
   
 }
@Component({
  selector        : 'app-register',
  templateUrl     : './register.component.html',
  providers       : [FormService],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy  {



  public registrationform    : any


  public obs$                = new Subject<void>()
  
  public location$         : Observable<any> | undefined | any
  public region$           : Observable<any> | undefined 
  public province$         : Observable<any> | undefined 
  public municipality$     : Observable<any> | undefined 
  public brgy$             : Observable<any> | undefined 
  public buttondisable$    : Observable<any> | undefined 

   
  private formBuilder      = inject(FormBuilder)
  private FormService      = inject(FormService)
  private apiservice       = inject(ApiService)
  private router           = inject(Router)
  private toastr           = inject(ToastrService)




  title$  =  getFormdata().pipe( 
  map((i:any) => (i.header) ),
  shareReplay(1)
  );
  
  registerlist$  : Observable<any> | undefined = getFormdata().pipe(
  tap((i:any) => {  

   this.registrationform = this.formBuilder.group(initFunc(i.data),{
   validator: Validators.compose([this.FormService.matchPassword('pass','confirmpass')])
   })

   let obj    = validationFunc(i.data,this.FormService)
   let val    = obj.validations
   let async  = obj.asyncvalidations

   val.map((x:any)=>{
   this.registrationform.controls[x.fieldname].setValidators(x.validations)
   this.registrationform.get(x.fieldname).updateValueAndValidity()
   })

   async.map((x:any)=>{
   this.registrationform.controls[x.fieldname].setAsyncValidators(x.validations)
   this.registrationform.get(x.fieldname).updateValueAndValidity()
   })
       

   if(i.header === 'Supplier'){ 

    this.location$      = locationFunc(this.apiservice)
    
    this.region$        = this.location$.pipe(map(((i:any)=> i.map((x:any) => x.region_name) ) ))

    this.province$      = combineLatest(
                          this.registrationform.get("region").valueChanges, 
                          this.location$  
                          ).
                          pipe(provinceFunc(this.registrationform))

    this.municipality$  = combineLatest(
                          this.registrationform.get("province").valueChanges, 
                          this.location$  
                          ).
                          pipe(municipalityFunc(this.registrationform))

    this.brgy$          = combineLatest(
                          this.registrationform.get("municipality").valueChanges, 
                          this.location$
                          ).
                          pipe(brgyFunc(this.registrationform))

   }
   

   this.buttondisable$ = combineLatest(
                         this.title$,  
                         this.registrationform.valueChanges
                         )
                         .pipe(submitButtonFunc(this.registrationform)) 
  
  }),
  map((i:any) => { return i.data  })
  )
  

  public buttonaction$    = new BehaviorSubject<any>(false)  

 
  constructor( ) {}
  


  ngOnInit() {}

  

  onFormSubmit(){
   
  this.title$.pipe(
  takeUntil(this.obs$),
  tap(() => { this.buttonaction$.next(true) }),
  switchMap((i:any) : any =>{

   let register         = {...this.registrationform.value}
   register.address     = ` ${this.registrationform.value.province} ${this.registrationform.value.municipality} ${this.registrationform.value.barangay === '- Select List -' ? '' : this.registrationform.value.barangay } `
    
   return this.apiservice.postRequest("account/add",{...register,...{role: i.toUpperCase()}}).pipe(
   tap((res) => { 
      
   if(res.status){  
   
   this.toastr.success(`${i} Registered Successfully`, 'Success') 
   this.buttonaction$.next(false)
   this.registrationform.reset()
  
   }  
      
    
   }),
   switchMap((res:any) => {
      
   return this.apiservice.postRequest("email/sendemail",{
   email    : res.data.email,
   template : this.FormService.htmlTemplate(
   res.data.verificationid,
   res.data.user,
   environment.email
   )
   }) 
  
   }),
   tap(() => { this.toastr.success('Email Send', 'Success') })
   )

   })

   ).subscribe()

    
  }

  login(){

  this.router.navigate(['login'])

  }
   

 ngOnDestroy(): void {
 this.obs$.next()
 this.obs$.complete()
 }
 

 
}
 