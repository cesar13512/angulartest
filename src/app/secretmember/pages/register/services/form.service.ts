
import { Injectable } from '@angular/core';

import { from, map, Observable, of, switchMap, timer } from 'rxjs';

import { AbstractControl, AsyncValidatorFn,  ValidationErrors, ValidatorFn} from '@angular/forms'
import { ApiService } from 'src/app/core/models/services/api.service';



                  
 
@Injectable()
export class FormService { 

    constructor(private apiservice: ApiService) {
    }

   getSupplierForm(){

    let array =
        [
            {
                "class"       : "row",
                "form"        : [
                 {
                 "label"      : "Supplier",
                 "fieldname"  : "supplier",
                 "fieldtype"  : "text",
                 "grid"       : "col-6",
                 },
                 {
                 "label"      : "User",
                 "fieldname"  : "user",
                 "fieldtype"  : "text",
                 "grid"       : "col-6",
                 }
                 ]
            },

            {
                "class"       : "row",
                "form"        : [
                 {
                 "label"      : "Password",
                 "fieldname"  : "pass",
                 "fieldtype"  : "password",
                 "grid"       : "col-6",
                 },
                 {
                 "label"      : "Confirm Password",
                 "fieldname"  : "confirmpass",
                 "fieldtype"  : "password",
                 "grid"       : "col-6",
                 }
                 ]
            },


            {
                "class"       : "row",
                "form"        : [
                {
                "label"      : "Address",
                "fieldname"  : "address",
                "fieldtype"  : "text",
                "grid"       : "col-6",
                 },
                 {
                 "label"      : "Phone Number",
                 "fieldname"  : "phonenumber",
                 "fieldtype"  : "text",
                 "grid"       : "col-6",
                 },
                 ]
            },

            {
                "class"       : "row",
                "form"        : [
                {
                "label"       : "Email",
                "fieldname"   : "email",
                "fieldtype"   : "text",
                "grid"        : "col-6",
                 },
                 ]
            },

     ]
     
     return array;
     
   }

   MemberAdminRegistration(){

    let array =

        [

            {
                "class"      : "row",
                "form"       : [
                {
                "label"      : "User",
                "fieldname"  : "user",
                "fieldtype"  : "text",
                "grid"       : "col-6",
                 },
                 {
                 "label"      : "Password",
                 "fieldname"  : "pass",
                 "fieldtype"  : "password",
                 "grid"       : "col-6",
                 },
                 ]
            },

            {
                "class"       : "row",
                "form"        : [
                 {
                 "label"      : "Confirm Password",
                 "fieldname"  : "confirmpass",
                 "fieldtype"  : "password",
                 "grid"       : "col-6",
                  },
               
                 ]
            },



         

        
    

       
     ]
    
     return array
    
   }

   findUser(http:string): AsyncValidatorFn    {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(1000).pipe(
    switchMap(() => this.apiservice.postRequest(http,{user:control.value})),
    map((i) => {
    return  i.status === false ? {finduser:false} : {finduser:true};
    })
    )
    }
    }

   findEmail(http:string): AsyncValidatorFn    {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(1000).pipe(
    switchMap(() => this.apiservice.postRequest(http,{email:control.value})),
    map((i) => {
    return  i.status === false ? {findemail:false} : {findemail:true};
    })
    )
    }
    }



    matchUser(source: string, target: string): ValidatorFn     {
         
    return (control: AbstractControl): ValidationErrors | null =>{
    
    const sourceCtrl = control.get(source)?.value;
    const targetCtrl = control.get(target)?.value;
    
    if(sourceCtrl === '' && targetCtrl === ''){
    return null
    }
    else if(sourceCtrl === targetCtrl){
    return {match:false} 
    }
    else{
    return {match:true} 
    }
 
 
    }
    }

    
    
   
    findSuppliers(http:string): AsyncValidatorFn    {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(1000).pipe(
    switchMap(() => this.apiservice.postRequest(http,{supplier:control.value})),
    map((i) => {
    return  i.status === false ? {findsupplier:false} : {findsupplier:true};
    })
    )
    }

    }


    detectFormerrors(): ValidatorFn    {

        return (control: AbstractControl): ValidationErrors | null  => {

        const array  : any =  []
        const result : any =  []
            
        this.getSupplierForm().map(y =>{  y.form.map(z => { array.push(z.fieldname) })})

         array.map((i:any)=>{
         if(i === 'user'){
         result.push(control.get(`${i}`)?.errors?.['required'])
         result.push(control.get(`${i}`)?.errors?.['finduser'])    
         }
         else if(i === 'supplier'){
         result.push(control.get(`${i}`)?.errors?.['required'])
         result.push(control.get(`${i}`)?.errors?.['findsupplier'])    
         }
         else if(i === 'findemail'){
         result.push(control.get(`${i}`)?.errors?.['required'])
         result.push(control.get(`${i}`)?.errors?.['findsupplier'])    
         }
         else{
         result.push(control.get(`${i}`)?.errors?.['required'])
         result.push(control.errors?.['match'])    
         }
         })
         let check = result.find((i:any) => { return i === true })

        if(check){
        return {allvalidate:true} 
        }
        else{ 
        return {allvalidate:false} 
        }
    }

}

    detectFormerrorsMemberAdmin(): ValidatorFn    {

        return (control: AbstractControl): ValidationErrors | null  => {

        const array  : any =  []
        const result : any =  []
            
        this.MemberAdminRegistration().map(y =>{  y.form.map(z => { array.push(z.fieldname) })})

        array.map((i:any)=>{
        if(i === 'user'){
        result.push(control.get(`${i}`)?.errors?.['required'])
        result.push(control.get(`${i}`)?.errors?.['finduser'])    
        }
        else if(i === 'pass' || i === 'confirmpass'){
        result.push(control.get(`${i}`)?.errors?.['required'])
        }
        else{    
        result.push(control.errors?.['match'])    
        }
        })
        
        let check = result.find((i:any) => { return i === true })

        if(check){
        return {allvalidate:true} 
        }
        else{ 
        return {allvalidate:false} 
        }
    }

    }

}
