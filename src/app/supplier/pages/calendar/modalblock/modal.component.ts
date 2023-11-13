import { Component, Output, EventEmitter, inject, ChangeDetectorRef, ViewRef, ChangeDetectionStrategy } from '@angular/core';

import { CrudService }  from '../../../services/crud.service'
import { BehaviorSubject, Observable, Subject, filter, first, map, of, pipe, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

function onDestroy() {

  const destroy$ = new Subject<void>();
  const viewRef  = inject(ChangeDetectorRef) as ViewRef;

  viewRef.onDestroy(() => {
  destroy$.next()
  destroy$.complete()
  })

  return destroy$

}



function notSelected() : any {

  return [

    {
      "label"     : "OnTime",
      "fieldname" : "ontime",
      "fieldtype" : "time",
      "grid"      : "col",
      "required"  : true,
    },

    {
      "label"     : "OffTime",
      "fieldname" : "offtime",
      "fieldtype" : "time",
      "grid"      : "col",
      "required"  : true,
    },
    
    {
      "label"     : "InTime",
      "fieldname" : "intime",
      "fieldtype" : "time",
      "grid"      : "col",
      "required"  : true,
    },

    
    {
      "label"     : "OutTime",
      "fieldname" : "outtime",
      "fieldtype" : "time",
      "grid"      : "col",
      "required"  : true,
    },



  ]

}

function submitButtonFunc(form: any) {

  return pipe(
  switchMap(() => {
  let counterror = 0
  Object.keys(form.controls).forEach(key => {
  if (
  form.get(key)?.errors?.required
  ) {
  counterror++
  }
  })
  return counterror === 0 ? of(false) : of(true)
  }),
  startWith(true)
  )

}



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ModallazyComponent {


  @Output() closeDialog     : EventEmitter<any> = new EventEmitter();

  public dateform       : any;
  public buttondisable$ : Observable<any> | undefined | any;

    
  public buttonaction$  = new BehaviorSubject<any>(false)


  public list$          = of(notSelected())
  

  public formBuilder    = inject(FormBuilder) 
  public crudService    = inject(CrudService) 
  private toastr        = inject(ToastrService)

  public destroy$       = onDestroy()
  
  public time$          = this.crudService.state$

  
  paginate$    = this.crudService.countData$.asObservable().pipe(
  filter(i =>  i!==0 ), 
  map   (i =>  ({ collectionSize: i , pageSize : Math.ceil(i/5)}) )
  )

  public editable$      = this.crudService.selectedProduct$.pipe(
  tap((i) => {

   if (i.id) {   

    Object.keys(i).forEach((key) => {
    notSelected().map((x: any) => {
    if (key === x.fieldname) {
    this.dateform.get(x.fieldname).setValue(i[key])
    }
    })
    })

   }

  }),
  shareReplay(1)
  )


  ngOnInit() {


    this.list$.pipe(
    tap((res)=>{
    
     let group: any = {}

     res.forEach((x: any) => { 
     const validators = []
     if (x.required) {
     validators.push(Validators.required)
     }
     if (x.pattern) {
     validators.push(Validators.pattern(x.pattern))
     }
     group[x.fieldname] = ['',validators]
     })
 
     this.dateform       = this.formBuilder.group(group)
     this.buttondisable$ = this.dateform.valueChanges.pipe(submitButtonFunc(this.dateform))

    }),  
    takeUntil(this.destroy$))
    .subscribe()


    this.crudService.productCrudActionStatus.pipe(
    tap((toast) => {
       
     if (toast === 'UPDATE') {

      this.dateform.reset()  
      this.toastr.success('Success ', `Success ${toast} List`.toUpperCase())
      this.crudService.selectProduct({})
      this.buttonaction$.next(false)
     
     }
 
     else if (toast === 'ADD') {
     this.toastr.info('Success ', `Success ${toast} List`.toUpperCase())
     this.buttonaction$.next(false)
     }
     
     
     else if (toast === 'DELETE') {
     this.toastr.warning('Success ', `Success ${toast} List`.toUpperCase())
     }
     
     else{
     this.toastr.error('Error ', `Status ${toast}`)
     }
 
    }),
    takeUntil(this.destroy$)
    ).subscribe()
 
    

  }

  Delete(res:any){
   
   


   if (confirm("Delete Time?") == true) {

    this.crudService.delete({
    http  : 'api/v1/addblocks',
    value : res.id
    })

   } 
       
       
  }

  Edit(res:any){

    if (confirm("Edit Time?") == true) {

     this.crudService.selectProduct(res)

    } 

           
  }

  paginateList(page:any){

    this.crudService.paginate({http: 'api/v1/addblocks',   value : page})   

   }
  

  onFormSubmit(){


   this.editable$?.pipe( 
   tap((i: any) => {   
  
    this.buttonaction$.next(true)

    if (!i.id) {

     this.crudService.save({
     http  : 'api/v1/addblocks',
     value : this.dateform.value
     })

     this.dateform.reset()

     }
     if(i.id){
    
     this.crudService.update({
     http: 'api/v1/addblocks',
     value: {...{id:i.id},...this.dateform.value}
     })
      
     }
    }),
    first(),
   ).subscribe()
 
  }

  closeModal(){
   this.closeDialog.emit(true)
  }
  

  
}