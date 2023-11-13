
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';

import {  map, mergeWith,  of,  scan,  shareReplay,  Subject } from 'rxjs';


import { InputService } from './services/input.service';
import { CrudService }  from '../../services/crud.service';
import { NgbModal }     from '@ng-bootstrap/ng-bootstrap';


import { Confirm        }    from './modal/modal.component';


import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';




function onDestroy() {

  const destroy$ = new Subject<void>();
  const viewRef  = inject(ChangeDetectorRef) as ViewRef;

  viewRef.onDestroy(() => {
  destroy$.next()
  destroy$.complete()
  })

  return destroy$

}

@Component({
  selector        : 'app-calender',
  templateUrl     : './calendar.component.html',
  providers       : [InputService,CrudService],
  changeDetection : ChangeDetectionStrategy.OnPush,
  styles: [`
 
  .example-list {
   border        : solid 1px #ccc;
   min-height    : 40px;
   background    : white;
   border-radius : 4px;
   overflow      : hidden;
   display       : block;
  }
  
  .example-box {
   padding: 5px 5px  5px 5px;
   border-bottom: solid 1px #ccc;
   color: rgba(0, 0, 0, 0.87);
   
   align-items: center;
   box-sizing: border-box;
   cursor: move;
   background: white;
   font-size: 12px;
  }


  



  


  `]
})
export class CalendarComponent {
 
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef | undefined;

  displayDialog = false;

  private inputService   = inject(InputService)
  private modalService   = inject(NgbModal)
  private crudService    = inject(CrudService)

  public dumbcalendar    : any = this.inputService.calendar;

  public employee$       = this.inputService.state$.pipe(shareReplay(1))

  public paginate$       = of(this.dumbcalendar).pipe(
                           map((i:any) =>  ({ collectionSize: i.length , pageSize : Math.ceil(i.length/5)}))
                           )

  public time$          = this.crudService.state$

  public productCrudActionSubject  = new Subject<any>()

  public calendarData$   = of(this.dumbcalendar)
  .pipe(
   map( (i:any) => ([{ header: 'EmployeeName' }].concat(i.slice(0,5))) )
   )
  .pipe(
   mergeWith(this.productCrudActionSubject.asObservable())
   )
  .pipe(
  scan((acc, action)  => {
  if (action.operation === 'PAGINATE') {
  
   const startIndex = (action.value - 1) * 5
   const endIndex   = startIndex + 5

   return [{ header: 'EmployeeName' }].concat(this.dumbcalendar.slice(startIndex,endIndex))
  
  }
  else{
   return acc
  }
  })
  )
  
  

  ngOnInit() {

    this.crudService.http$.next('api/v1/addblocks')

  }
 
  

   addSched(){


      
   }


   availClick(id:any,data:any){

    const modal = this.modalService.open(Confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
    modal.componentInstance.dayselected  =  data.day.toString()
    modal.componentInstance.type         = 'notoptionselected' 
    modal.componentInstance.passEntry.subscribe((result:any) => {

    if(result){
     console.log(result)
     this.inputService.save({
     http  : 'api/v1/schedules',
     value :  {...{key:data },...{id:id},...{result:result}}
     })

    }
    })

  
    
   }
   
    
  paginateList(page:any){

    this.productCrudActionSubject.next({operation: 'PAGINATE',   value : page})
    this.inputService.paginate({value : page})
    
  }
  

  Submit(){
  console.log(this.inputService.dumbdata)
  }

  drop(event: CdkDragDrop<string[]>) {

    this.employee$.subscribe((viewdata)=>{
      
      let dumb = JSON.parse(JSON.stringify(this.inputService.dumbdata))
      
      dumb.map((dumb:any)=>{

       viewdata.map((viewdata:any)=>{

       if(dumb.id === viewdata.id){
      
        dumb.availdate.map((dumbavaildate:any)=>{

         viewdata.availdate.map((availdate:any)=>{

          if(dumbavaildate.day === availdate.day){
          dumbavaildate.schedule = availdate.schedule
          }

         })

        })
    
       }
       })
      })

      this.inputService.dumbdata = dumb

    })
    
 

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
     
    }
  }
  
  async addBlock(){

    let component = await import ('./modalblock/modal.component')
    console.log("add")
    console.log("add")
    console.log("add")
    this.modalContainer?.clear()
    console.log("add")
   
    const modalComponentRef = this.modalContainer?.createComponent(component.ModallazyComponent);
    modalComponentRef?.instance.closeDialog.subscribe((res)=>{
    if(res){
      console.log("test")
      console.log("test")
      console.log("test")
      console.log("test")
    this.modalContainer?.clear()
    }
    })

  }
 
  timeTotal(res:any){
    

    let result = 0

    res.availdate.forEach((availdate:any)=>{
    
     availdate.schedule.forEach((y:any)=>{
        
     let dup         = {...y}
     var ontimeArr   =  dup.ontime.split(":");
     var offtimeArr  =  dup.offtime.split(":");
     var intimeArr   =  dup.intime.split(":");
     var outtimeArr  =  dup.outtime.split(":");


     var ontimeDate  : any = new Date();
     ontimeDate.setHours(parseInt(ontimeArr[0]), parseInt(ontimeArr[1]), parseInt(ontimeArr[2]), 0);
     
     var offtimeDate : any  = new Date();
     offtimeDate.setHours(parseInt(offtimeArr[0]), parseInt(offtimeArr[1]), parseInt(offtimeArr[2]), 0);
     
     var intimeDate  : any = new Date();
     intimeDate.setHours(parseInt(intimeArr[0]), parseInt(intimeArr[1]), parseInt(intimeArr[2]), 0);
     
     var outtimeDate : any   = new Date();
     outtimeDate.setHours(parseInt(outtimeArr[0]), parseInt(outtimeArr[1]), parseInt(outtimeArr[2]), 0);

     var hoursOnTimeToOffTime = (offtimeDate - ontimeDate) / (1000 * 60 * 60);
     var hoursInTimeToOutTime = (outtimeDate - intimeDate) / (1000 * 60 * 60);

     result += hoursOnTimeToOffTime + hoursInTimeToOutTime


    })
    
    })
   
    return result

  }
}
