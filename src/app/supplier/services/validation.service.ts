
import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AbstractControl, AsyncValidatorFn,  ValidationErrors} from '@angular/forms'
import { Observable,  distinctUntilChanged,  map,   switchMap,  tap,  timer, } from 'rxjs';
import { ApiService } from 'src/app/core/models/services/api.service';



@Injectable({
 providedIn : 'any'
})

export class ValidationService { 

  private apiservice               = inject(ApiService)


  findDuplicate(http:string): AsyncValidatorFn    {

      
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const params = new HttpParams().append('bioid[eq]',control.value)
    return timer(500).pipe(
    distinctUntilChanged(),
    switchMap(() => {
    return this.apiservice.getRequest(http, params).pipe(
    map((i:any) => ({find : i.data.length === 0 ? false : true }) )
    )
    })
    ) 
    }
    
   } 

   

    
  }



