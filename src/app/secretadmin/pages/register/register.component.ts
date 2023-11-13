
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService }                   from '../../../core/models/services/api.service'; 
import { FormBuilder,  Validators }     from '@angular/forms';
import { FormService }                  from './services/form.service'; 
import { concatMap, map, shareReplay, takeUntil, tap }  from 'rxjs/operators'
import { ToastrService }                from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers : [FormService]
})
export class RegisterComponent implements OnInit, OnDestroy  {

  public registrationform    : any;
  public registerlist$       : any;

  public memberform          : any;
  public memeberlist$        : any;

  public adminform           : any;
  public adminlist$          : any;

  public obs$      = new Subject<void>();
  public role      : any;
  
  public navtabs   : any = [

  {
    "label"      : "Supplier Registration",
    "class"      : true,
  },
  
  {
    "label"      : "Member Registration",
    "class"      : false,
  },

  
  {
    "label"      : "Admin Registration",
    "class"      : false,
  },

  ]  
  
  public selectedValue2 = 0
  



  constructor(
    private apiservice: ApiService, 
    private formBuilder  : FormBuilder,
    private FormService  : FormService,
    private router: Router,
    private toastr: ToastrService
   ) {
  }


  ngOnInit() {

   this.adminForm()

  }
  

  adminForm(){

    const  formsetting$ = of(this.FormService.MemberAdminRegistration()).pipe(shareReplay())
    formsetting$.pipe(takeUntil(this.obs$),map((i) => {
    const group: any = {};
    i.map(x =>{  x.form.map(y => {
    if(y.fieldname === 'user'){  
    group[y.fieldname] = ['', [Validators.required],[this.FormService.findUser('account/find')]] 
    }
    else{
    group[y.fieldname] = ['', [Validators.required]] 
    }
    })})
    return group
    })
    ).subscribe((res:any) => {
    this.adminform = this.formBuilder.group(res,{validators:  
    Validators.compose(
    [
    this.FormService.matchUser('pass','confirmpass'),
    this.FormService.detectFormerrorsMemberAdmin()
    ]
    )
    })
    })

    this.adminlist$ = formsetting$


  }

  public spinneradmin     = false;

   
  onFormSubmit(){


    this.spinneradmin = true;
    this.apiservice.postRequest("account/add",{...this.adminform.value,...{role:'ADMIN'}}).subscribe((res:any)=>{
    if(res.status){
    this.spinneradmin = false;
    this.toastr.success('Admin Registered Successfully', 'Success');
    this.adminform.reset()
    }
    })


  
  



   


  }

  login(){

    this.router.navigate(['login'])

  }





  ngOnDestroy(): void {
    this.obs$.next()
    this.obs$.complete()
  }



}
 