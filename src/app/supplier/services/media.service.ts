
import { Injectable } from '@angular/core';

import { BehaviorSubject, of, switchMap, } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class MediaService {


  public  checkmedia$ = new BehaviorSubject<any>([])

  public media$      =  of(['(min-width: 768px)','(max-width: 767px)']).pipe(
                        switchMap((i:any)=>{
                         
                         let arr : any = []

                         i.map((x:any)=>{

                         const handleDeviceChange = ((e:any) => 
                         e.matches ? true : false
                         )
  
                         const detection = window.matchMedia(x);
  
                         detection.addEventListener('change',handleDeviceChange)
                         let change = handleDeviceChange(detection)
                         detection.removeEventListener('change',handleDeviceChange)
                      
                         arr.push(change)
                  
                         })

                        return of(arr)
                          
                        })
                        )

  constructor(
   ) {
  
  }












}



