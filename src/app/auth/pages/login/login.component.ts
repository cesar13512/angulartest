import { Component} from '@angular/core';
import { ApiService } from '../../../core/models/services/api.service'; 
import { FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CurrentUserService } from '../../../useractivate.service'


@Component({
  selector     : 'app-login',
  templateUrl  : './login.component.html',
})
export class LoginComponent  {

  public loginform   : any;


  constructor(
  private apiservice   : ApiService, 
  private formBuilder  : FormBuilder,
  private router       : Router,   
  private toastr       : ToastrService,
  private CurrentUserService : CurrentUserService
  
  ) {
  }
  

  ngOnInit() {

    this.loginform = this.formBuilder.group({
    user     : ['', [Validators.required]], 
    pass     : ['', [Validators.required]]
    })
    
  }
   
  
  public buttonstop  : any = null;
  public spinner     = false

  onFormSubmit(){

    this.buttonstop  = true
    this.spinner     = true

    this.apiservice.postRequest("login/login",this.loginform.value).subscribe(res =>{ 
   
    if(res.status !== true){
    this.spinner    = false
    this.buttonstop = null 

    this.toastr.error('Error ', `Check user and Password`)
    }
    else{


      if(res.role === 'SUPPLIER'){
      this.spinner    = false
      this.buttonstop = null
      localStorage.setItem('user', JSON.stringify(res))
      this.CurrentUserService.setCurrentUser()
      this.router.navigate(['supplierpage/home/addproduct'])
      }
      if(res.role === 'ADMIN'){
      this.spinner    = false
      this.buttonstop = null
      localStorage.setItem('user', JSON.stringify(res))
      this.CurrentUserService.setCurrentUser()
      this.router.navigate(['adminpage/home/dashboard'])
      }
      if(res.role === 'MEMBER'){
      this.spinner    = false;
      this.buttonstop = null;
      localStorage.setItem('user', JSON.stringify(res))
      this.CurrentUserService.setCurrentUser()
      this.router.navigate(['memberpage/home/dashboard'])
      }
      if(res.role !== 'SUPPLIER'){
      this.spinner    = false
      this.buttonstop = null 
      this.toastr.error('Error ', `Unathorized`)
      }
    }
  

    

    })
  }

  register(res:any){

   this.router.navigate(['register'], { queryParams: { header: res } });

  } 
  
  forgotPasswordlink(){
    this.router.navigate(['retrieve'])
  }
  
  adminRoute(){

    this.router.navigate(['admin'])

  }
   
  checkCondition(res:any){

   if(this.buttonstop === null || res){
   return res
   }
   else if(this.buttonstop === true){
   return true
   }
   else{}


 } 

}
 