import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { ApiService  } from './services/api.service';
import { localStore  } from './services/jsonconvert.service';
import { MyInterceptor  } from './services/my.interceptor';
import { CommonModule }           from '@angular/common'


 
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ApiService,
    localStore,
    // {
    //  provide: HTTP_INTERCEPTORS,
    //  useClass: MyInterceptor,
    //  multi: true
    // }
  ],
  declarations: []
})
export class CoreModule { 
 
  constructor(@Optional() @SkipSelf() core:CoreModule ){
    if (core) {
        throw new Error("You should import core module only in the root module")
    }
  }
}
 