import { Injectable } from "@angular/core";
import { Router,CanLoad,Route } from "@angular/router";

import  { CurrentUserService } from "./useractivate.service"
import { Observable, map } from "rxjs";

@Injectable()
export class AuthGuardService implements CanLoad {
  constructor(
  private router: Router, 
  private currentUserService :CurrentUserService) {
  }
 
  canLoad(route: Route): Observable<boolean>  {
   
   return this.currentUserService.currentUser$.asObservable().pipe(
   map((currentUser) => {
   
   if (!currentUser) {
    
   this.router.navigate(['']);
   return false

   }
   if (currentUser) {
   return true
   }

   return true;
   })
  )
    
    
  } 
} 