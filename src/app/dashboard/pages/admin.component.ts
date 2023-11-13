import { Component} from '@angular/core';
import { ApiService } from '../../core/models/services/api.service'; 
import { FormBuilder,  Validators } from '@angular/forms';

import { Router, Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';

import { FormService   }   from '../services/form.service'; 



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent  {

  public user : any



  constructor(private apiservice: ApiService, private formBuilder  : FormBuilder,private router: Router,  private formService  : FormService) {

  }

  ngOnInit() {


    
    // this.router.events.subscribe((event: Event) => {
    // if (event instanceof NavigationStart) {
    // this.formService.clear()

    // this.formService.initquery     = false
    // this.formService.sortquery     = [{"key": "id", "key1": "DESC"}] 
    // this.formService.where         = {}
    // this.formService.searchquery   = ''
    // }
    // });
    

  
   
   } 

   

   logout(){

    this.router.navigate([''])
    localStorage.removeItem('user')

    // window.location.href='https://confednegros-panay.com/';
    
   }
  


}
 