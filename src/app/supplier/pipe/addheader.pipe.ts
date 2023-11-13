import { Pipe, PipeTransform } from '@angular/core';
import { delay, map, Observable, of, startWith, switchMap, tap } from 'rxjs';


@Pipe({
  name: 'concatHeader',
})
export class addheaderPipe implements PipeTransform {
  transform(val:any) {
    
    let newres = [...val]
    newres.push({label:"Delete"})
    newres.push({label:"Edit"})
    return newres
    
  }
}

