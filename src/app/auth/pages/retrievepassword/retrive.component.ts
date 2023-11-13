import { Component, inject} from '@angular/core';
import { ApiService } from '../../../core/models/services/api.service'; 
import { AbstractControl, FormBuilder,  ValidationErrors,  ValidatorFn,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService }          from 'ngx-toastr';
import { environment }            from 'src/environments/environment';
import { Observable, Subject,  map, of, startWith, switchMap, tap, pipe, takeUntil, filter, shareReplay, iif, BehaviorSubject } from 'rxjs';


function validationFunc(i:any):any{

 return i.map((x:any)  => { 

 let validations = []
    
 if(x.pattern){
 validations.push(Validators.pattern(x.pattern))
 }
 if(x.required){
 validations.push(Validators.required)
 }
   
 if(validations.length > 0){
 return {fieldname:x.fieldname, validations : validations}
 }
    
 return {}

 })
 

}

function initFunc(i:any):any{

 const group: any = {}
 i.map((x:any)  => { group[x.fieldname] = [''] })
 return group

}

function submitButtonFunc(form:any){
  
 return pipe(
 switchMap((i:any) =>{

 let counterror = 0

 Object.keys(form.controls).forEach(key => {
 if(
 form.get(key)?.errors?.required     ||
 form.get(key)?.errors?.pattern      
 ){
 counterror++
 }
 }) 

 if(!counterror){
 return of(false)
 }
 else{
 return of(true)
 }
 }),
 startWith(true)
 )

}


function routeparamShare() : Observable<any> | any { 
 return inject(ActivatedRoute).queryParamMap.pipe(shareReplay(1)) 
} 
 
 


function getHostUrl() : Observable<any> | any { 

  return inject(ActivatedRoute).queryParamMap.pipe(
  switchMap((params:any) => 
  iif(() => 
  params.get('header') === null, 
  of({ 
  header : 'Forgot Password', 
  data : [{
  "label"      : "User",
  "fieldname"  : "user",
  "fieldtype"  : "text",
  "grid"       : "col-12",
  "required"   : true
  },
  {
  "label"      : "Email",
  "fieldname"  : "email",
  "fieldtype"  : "text",
  "grid"       : "col-12",
  "required"   : true
  },
  ]}), 
  of({ 
  header : 'Confirm New Password',   
  data : [{
  "label"      : "Password",
  "fieldname"  : "password",
  "fieldtype"  : "password",
  "grid"       : "col-12",
  "required"   : true
  },
  {
  "label"      : "Confirm Password",
  "fieldname"  : "confpassword",
  "fieldtype"  : "password",
  "grid"       : "col-12",
  "required"   : true,
  },
  ]}) 
  ))
  )

} 




@Component({
  selector     : 'app-retrieve',
  templateUrl  : './retrieve.component.html',
})
export class retrieveCpmponent  {

  public form     : any;

  public buttondisable$   :  Observable<any> | undefined 


  public obs$             = new Subject<void>();
     
  
  public buttonstop        : any = null



  private formBuilder      = inject(FormBuilder)
  private apiservice       = inject(ApiService)
  private router           = inject(Router)
  private toastr           = inject(ToastrService)

  public buttonaction$     = new BehaviorSubject<any>(false)  


  public routeparamShare   = routeparamShare()



  title$  = getHostUrl().pipe( 
  map((i:any) => (i.header)),
  shareReplay(1)
  )

  list$  : Observable<any> | undefined = getHostUrl().pipe(
  tap((i:any) => {  

  if(i.header === 'Forgot Password'){
  this.form = this.formBuilder.group(initFunc(i.data))
  }
  if(i.header === 'Confirm New Password'){
  this.form = this.formBuilder.group(initFunc(i.data),{
  validator: Validators.compose([this.matchPassword('password','confpassword')])
  })
  }

  validationFunc(i.data).map((x:any)=>{
  this.form.controls[x.fieldname].setValidators(x.validations)
  this.form.get(x.fieldname).updateValueAndValidity()
  })

  this.buttondisable$ =  this.form.valueChanges.pipe(submitButtonFunc(this.form))
   
  }),
  map((i:any) => { return i.data  })
  )
    


  constructor(
  ) {
  }
  

  ngOnInit() {
   
   
   

   
   

    
  }

  onFormSubmit(){

   this.title$.pipe(takeUntil(this.obs$),
   tap(() => { this.buttonaction$.next(true) }),
   switchMap((i:any) =>{
   if(i === 'Forgot Password'){
   
    return this.apiservice.postRequest("account/findEmail",this.form.value).pipe(
    map((res) => { 
   
    if(res.status){  
       
     let result         = {...res.data}
     let members        = result.members
     let suppliers      = result.suppliers
       
     let membercheck    = members.find((i:any)   => i.email === this.form.value.email )
     let suppliercheck  = suppliers.find((i:any) => i.email === this.form.value.email )
   
     if(membercheck){
     return {verificationid: res.data.verificationid, check : membercheck }
     } 
     if(suppliercheck){
     return {verificationid: res.data.verificationid, check : suppliercheck }
     }
     if(!membercheck && !suppliercheck){
     return {email:false}
     }
      
   
     }
     if(!res.status){  
     return {user:false}
     }  
   
     return true
   
     }),
     tap((res:any) => {
   
     if(res.verificationid){
     this.toastr.success('Email and User Verified', 'Success') 
     this.form.reset()
     }
     if(res.email === false){
     this.toastr.error('Error ', `Check Email`)
     }
     if(res.user  === false){
     this.toastr.error('Error ', `Check user`)
     }
         
     }),
     filter(i =>  i.verificationid ), 
     switchMap((i:any)=>{
       
     return this.apiservice.postRequest("email/sendemail",{
     email    : i.check.email,
     template : this.htmlTemplate(i.verificationid)
     })
   
     }),
     tap(() => { 
     this.toastr.success('Email Send', 'Success') 
     this.buttonaction$.next(false) 
     })
     )

   }
   else{

    
    return this.routeparamShare.pipe(
    switchMap((params:any)=>{
    let verificationid = {verificationid : params.get('header')}
    return this.apiservice.postRequest("account/reset",{...verificationid,...this.form.value}).pipe(
    tap(() => { 
    this.toastr.success('Change Password', 'Success') 
    this.form.reset()
    this.buttonaction$.next(false)
    })
    )
    })
    )
   
    

   }
   })
   ).subscribe()


    

  }
  
  

  htmlTemplate(link:any){
  
  let template = `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Simple Transactional Email</title>
      </head>

      <body>
      
      <form >
        <div class="container" style="padding: 20px; background-color: #f1f1f1;">
          <h2>
            <img src="https://member.confed.org/assets/img/sample.png" alt="Smiley face" style="float: left; width: 42px; height: 42px;">
            Confederation of Sugar Producers Assn. Inc.
          </h2>
        </div>

        <div class="container" style="background-color: white;">
        <br>
        <br>
        Enter this link to change your password
        </div>

        <div class="container">
        <br>
        <br>
          <a href="${environment.email}/retrieve?header=${link}">
            <input type="submit" value="Link to Change Password" style="background-color: #04AA6D; color: white; border: none; width: 100%; padding: 12px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box;">
          </a>
        </div>
      </form>
      </body>
      </html>`
  
    return template

  }
 

  matchPassword(source: string, target: string): ValidatorFn     {
         
    return (control: AbstractControl): ValidationErrors | null =>{
    
    const sourceCtrl = control.get(source)?.value;
    const targetCtrl = control.get(target)?.value;

    
    if(!sourceCtrl && !targetCtrl){
    return {match:false} 
    }
    
    if(sourceCtrl === targetCtrl){
    return {match:false} 
    }

    if(sourceCtrl !== targetCtrl){
    return {match:true} 
    }
     
    return null
 
    }
  }


  
  login(){

    this.router.navigate(['login'])

  }

  ngOnDestroy(): void {
    this.obs$.next()
    this.obs$.complete()
    }
 

}
 