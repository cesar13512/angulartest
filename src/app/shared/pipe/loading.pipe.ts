import { Pipe, PipeTransform } from '@angular/core';
import { delay, Observable, of, startWith, switchMap, tap } from 'rxjs';


@Pipe({
  name: 'withLoading',
})
export class WithLoadingPipe implements PipeTransform {
  transform(val:Observable<any>) {
    return val.pipe(
     switchMap((i: any) => {
      console.log(i)
      if (Array.isArray(i)){
      return of({load: true, value: i }).pipe(delay(500))
      }
      else{
      return of(i)
      }
    
      }),
      startWith({ loading : true }),    
      )
    
  }
}

@Pipe({
  name: 'searchLoading',
})
export class SearchLoadingPipe implements PipeTransform {
  transform(val:Observable<any>) {
    return val?.pipe(
     switchMap((i: any) => {  
      if (Array.isArray(i)) {
      return of({load: true, value: i }).pipe(delay(500))
      }
      else{
      return of(i)
      }
    
      }),
    )
    
  }
}