import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CurrentUserService {
  asObservable() {
    throw new Error('Method not implemented.');
  }

  public currentUser$ = new BehaviorSubject<any>(null)

  setCurrentUser() {
    if (localStorage.getItem('user')) {

      let json = JSON.parse(localStorage.getItem('user') as any)
  
      this.currentUser$.next(json)

    }
  }
}