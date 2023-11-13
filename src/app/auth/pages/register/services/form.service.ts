
import { Injectable } from '@angular/core';

import {  debounceTime, distinctUntilChanged, map, Observable, switchMap,  timer } from 'rxjs';

import { AbstractControl, AsyncValidatorFn,  ValidationErrors, ValidatorFn} from '@angular/forms'
import { ApiService } from 'src/app/core/models/services/api.service';
import { HttpParams } from '@angular/common/http';



@Injectable()
export class FormService { 

    constructor(private apiservice: ApiService) {
    }



   getSupplierForm(){
   
   return     [
        
                 {
                 "label"      : "Supplier Name",
                 "fieldname"  : "supplier",
                 "fieldtype"  : "text",
                 "grid"       : "col-12",
                 "required"   : true,
                 "http"       : "supplier/findOne",
                 },

                 {
                 "label"      : "Account",
                 "fieldname"  : "user",
                 "fieldtype"  : "text",
                 "grid"       : "col-12",
                 "required"   : true,
                 "http"       : "account/findOne",
                 },
        
                 {
                 "label"      : "Password",
                 "fieldname"  : "pass",
                 "fieldtype"  : "password",
                 "grid"       : "col-12",
                 "required"    : true,
                 },
                 {
                 "label"      : "Confirm Password",
                 "fieldname"  : "confirmpass",
                 "fieldtype"  : "password",
                 "grid"       : "col-12",
                 "required"    : true,
                 },
   
                 {
                 "label"      : "Phone Number",
                 "fieldname"  : "phonenumber",
                 "fieldtype"  : "text",
                 "grid"       : "col-12",
                 "pattern"    : '^[0-9]*$',
                 "required"   : true,
                 "length"     : true
                 },
                 
       
                {
                "label"       : "Email",
                "fieldname"   : "email",
                "fieldtype"   : "text",
                "grid"        : "col-12",
                "required"    : true,
                "pattern"     : "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
                "http"        : "supplier/findOne"
                 },
                 
                {
                 "label"       : "Region",
                 "fieldname"   : "region",
                 "grid"        : "col-12",
                 "required"    : true,
                 "select"      : true
                },

                {
                 "label"       : "Province",
                 "fieldname"   : "province",
                 "grid"        : "col-12",
                 "required"    : true,
                 "select"      : true
                },
                {
                 "label"       : "Municipality",
                 "fieldname"   : "municipality",
                 "grid"        : "col-12",
                 "required"    : true,
                 "select"      : true
                },

                {
                 "label"       : "Brgy",
                 "fieldname"   : "barangay",
                 "grid"        : "col-12",
                 "select"      : true
                },
              
            
        
        ]
     

   }
   

   
   getMemberForm(){

     return   [

                 {
                 "label"      : "User",
                 "fieldname"  : "user",
                 "fieldtype"  : "text",
                 "grid"       : "col-12",
                 "required"   : true,
                 "http"       : "account/findOne",
                 },
        
                 {
                 "label"      : "Password",
                 "fieldname"  : "pass",
                 "fieldtype"  : "password",
                 "grid"       : "col-12",
                 "required"    : true,
                 },
                 {
                 "label"      : "Confirm Password",
                 "fieldname"  : "confirmpass",
                 "fieldtype"  : "password",
                 "grid"       : "col-12",
                 "required"    : true,
                 },
   
                 {
                 "label"      : "Phone Number",
                 "fieldname"  : "phonenumber",
                 "fieldtype"  : "text",
                 "grid"       : "col-12",
                 "pattern"    : '^[0-9]*$',
                 "required"   : true,
                 "length"     : true
                 },
                 
       
                {
                "label"       : "Email",
                "fieldname"   : "email",
                "fieldtype"   : "text",
                "grid"        : "col-12",
                "required"    : true,
                "pattern"     : "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
                "http"        : "member/findOne"
                 },
        
        ]
 
     
   }
   

 

   findDuplicate(http:string,key:any): AsyncValidatorFn    {

    
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

    const params = new HttpParams().append(key,control.value)

    return timer(500).pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(() => this.apiservice.getRequest(http,params)),
    map((i:any) => i.status === false ? {duplicate:false} : {duplicate:true})

    )
    }
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



    phoneNumberlegth(): ValidatorFn     {
         
    return (control: AbstractControl): ValidationErrors | null =>{
      
    const sourceCtrl = control.value;

    if(!sourceCtrl){
    return {length:true}
    }
 
    if(sourceCtrl.length === 11){
    return {length:false}
    }
  
    if(sourceCtrl.length > 11 || sourceCtrl.length < 11){
    return {length:true}
    } 
    
    return null
     

    }
   }
  

htmlTemplate(res:any,user:any,url:any){

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
      Welcome <b>${user}</b>, This is the first step to verify your account 2nd step will be the admin to verify wait for email notification for admin approval. please press the link below
    </div>

    <div class="container">
    <br>
    <br>
      <a href="${url}/verification/admin/${res}">
        <input type="submit" value="Verify Account" style="background-color: #04AA6D; color: white; border: none; width: 100%; padding: 12px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box;">
      </a>
    </div>
  </form>

  

  </body>
  </html>
 `
 
 return template;

}


}
