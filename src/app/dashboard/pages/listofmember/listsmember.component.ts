import { ChangeDetectionStrategy, Component} from '@angular/core';


import { FormService   }   from '../../services/form.service'; 

import { ModalContentComponent } from './modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged,  map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { ToastrService }   from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';




@Component({
  
  selector: 'app-listmember',
  providers       : [FormService],
  templateUrl: './listsmember.component.html',
  styles: ['hr { height: 4px; margin-left: 15px; margin-bottom:-3px; }  .hr-success{ background-image: -webkit-linear-gradient(left, rgba(15,157,88,.8), rgba(15, 157, 88,.6), rgba(0,0,0,0)); }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListmemberComponent  {

  public dataref  : any = [];

  public dataobs$ : any = [];
  

  user$       = this.formService.data$

  paginate$   = this.formService.countData$.pipe(
  map((i)=>{
  let arr = []
  let x   = 0
  while ( x < Math.ceil(i/5) ) { 
  arr.push({number:x+1})
  x++ 
  }
  return arr
  })  
  )

  
  public obs$ = new Subject<void>();
  searchgroup: any;


  constructor(
  public  modalService : NgbModal,  
  private toastr       : ToastrService,
  private formService  : FormService,   
  private formBuilder  : FormBuilder
  
  ) {
  }


  ngOnInit() {

   this.searchgroup = this.formBuilder.group({
   search           : [''],
   filter           : ['Default'],
   })
   
   
   this.searchgroup.get("search").valueChanges.pipe(
   takeUntil(this.obs$),
   debounceTime(500),
   distinctUntilChanged(),
   switchMap((res:any) =>{
   if(res === ''){ return of([])  }
   else{ return of(res) }
   }),
   tap((i:any)=>{
 
   this.formService.search({
   http  : 'account/findall', 
   model : 'member',
   value : {search : i.length === 0 ? '' : i},
   })

     
   })
   ).subscribe()
    

   this.formService.productCrudActionStatus.pipe(
   takeUntil(this.obs$),
   tap((toast) => {
   if(toast === 'UPDATE'){
   this.toastr.success('Success ', `Success ${toast} List`.toUpperCase())
   }
   }
   ),
   ).subscribe()

   this.searchgroup.get("filter").valueChanges.pipe(
   takeUntil(this.obs$),
   tap((res:any)=>{
   this.formService.sort({ 
   http  : 'account/findall', 
   model : 'member',
   value :  res
   })
   })
   ).subscribe()
   

   if(this.formService.initquery){
   this.formService.login$.next({init:true ,http:'account/findall',model:'member'})
   }
  


      
   
   
  }

   
  approve(id:any){

    
    const modal = this.modalService.open(ModalContentComponent, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
    modal.componentInstance.passEntry.subscribe((result:any) => {
    if(result){
      
     this.formService.update({ http:'account/verifylast',  value :  {id:id} })

    }

   })
  
  }

  trackByFn(index:any, item:any) {
    return item.id;
  }


    
 paginateList(page:any){
   
  this.formService.paginate({http:'quatation/pageall',  model : 'member', value : page})

 }

 ngOnDestroy(): void {
  this.obs$.next()
  this.obs$.complete()
 }

 

}

 