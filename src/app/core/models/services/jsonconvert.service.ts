
import { Injectable } from '@angular/core';


 

 
@Injectable()
export class localStore { 
   
      

   returnJSON(res:any) : any {


    return JSON.parse(localStorage.getItem(`${res}`) as any)
  
   

   }

   

}