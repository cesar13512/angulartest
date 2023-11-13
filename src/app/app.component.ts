import { Component } from '@angular/core';

import { CurrentUserService } from './useractivate.service'

@Component({
  selector    : 'app-root',
  templateUrl : './app.component.html',
  styleUrls   : ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  
  
  constructor(
  private CurrentUserService : CurrentUserService  
  ){
  }

  ngOnInit() {

  this.CurrentUserService.setCurrentUser()
   
  }
}
