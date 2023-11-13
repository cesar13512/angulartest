
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
 

 
@Injectable()
export class ApiService { 
  
    baseURL:string= environment.url;
 
   constructor(private http:HttpClient){
   }
 
   getRequest(route:any,key?:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}${route}`, { params: key })
   }

   deleteRequest(route:any,data:any){
   return this.http.delete<any>(`${this.baseURL}${route}/${data}`)
   }

   postRequest(route:any,data:any){
   return this.http.post<any>(`${this.baseURL}${route}`, data)
   }

   putRequest(route:any,key:any,body:any){
   return this.http.put<any>(`${this.baseURL}${route}/${key}`, body)
   }

   

}