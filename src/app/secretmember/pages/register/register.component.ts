
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

   this.memberForm()

  }
  

  memberForm(){

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
    this.memberform = this.formBuilder.group(res,{validators:  
    Validators.compose(
    [
    this.FormService.matchUser('pass','confirmpass'),
    this.FormService.detectFormerrorsMemberAdmin()
    ]
    )
    })
    })

    this.memeberlist$ = formsetting$


  }

  public spinnermember     = false;

   
  onFormSubmit(){


    this.spinnermember = true;
    this.apiservice.postRequest("account/add",{...this.memberform.value,...{role:'MEMBER'}}).subscribe((res:any)=>{
    if(res.status){
    this.spinnermember = false;
    this.toastr.success('Member Registered Successfully', 'Success');
    this.memberform.reset()
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
 