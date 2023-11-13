import { Component, OnInit, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, iif, of, pipe, startWith, switchMap, tap } from 'rxjs';


function selectedOption() : any {

  return [
  {
      "label"     : "Start Date",
      "fieldname" : "start",
      "fieldtype" : "text",
      "grid"      : "col",
      "select"    : true,
      "required"  : true,
    },

    {
      "label"     : "End Date",
      "fieldname" : "end",
      "fieldtype" : "text",
      "grid"      : "col",
      "select"    : true,
      "required"  : true,
    },

    {
      "label"     : "Start Time",
      "fieldname" : "startTime",
      "fieldtype" : "time",
      "grid"      : "col",
      "required"  : true,
    },

    {
      "label"     : "End Time",
      "fieldname" : "endTime",
      "fieldtype" : "time",
      "grid"      : "col",
      "required"  : true,
    }



  ]

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
  selector    : 'app-modal-content',
  templateUrl : './modal.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush,
})
export class Confirm implements OnInit {

  @Output() passEntry     : EventEmitter<any> = new EventEmitter();

  public day      : any;
  public dateform : any;
  public list$            : Observable<any> | undefined ;  
  public buttondisable$   : Observable<any> | undefined | any;




  @Input('day')
  set setday(data:any){
  this.day = data
  }
  get getday(){
  return this.day
  }

  @Input() type: any;

  @Input() dayselected: any;

  
  
  public  activeModal   = inject(NgbActiveModal) 
  public  formBuilder   = inject(FormBuilder) 


 

  



 
  ngOnInit() {
   

    this.list$ = of(this.type).pipe(switchMap((i:any)=>{
    return iif(() => i === 'optionselected', of(selectedOption()), of(notSelected()))
    }),
    tap((res)=>{

     let group: any      = {}

     res.map((x: any)    => { 

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

    })
    )

    
  
   
    
  }



  onFormSubmit(){
    
   console.log(this.dateform.value)
   const date  = new Date()

   const year  = date.getFullYear()
   const month = String(date.getMonth() + 1).padStart(2, '0')
   const day   = this.dayselected.padStart(2, '0')

   const formattedDate = `${year}-${month}-${day}`
   

   this.dateform.value.ontime    = `${formattedDate} ${this.dateform.value.ontime}`
   this.dateform.value.offtime   = `${formattedDate} ${this.dateform.value.offtime}`
   this.dateform.value.intime    = `${formattedDate} ${this.dateform.value.intime}`
   this.dateform.value.outtime   = `${formattedDate} ${this.dateform.value.outtime}`
    
    
   this.activeModal.close()
   this.passEntry.emit(this.dateform.value)

 
  }
}