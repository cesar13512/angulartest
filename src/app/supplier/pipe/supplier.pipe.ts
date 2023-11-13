import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removedatepipe',
})
export class RemoveDatePipe implements PipeTransform {
  transform(val:any) {  
    
    if(val){
    if(val.length !== 8){
    let updatedStr = val.replace(/\d{4}-\d{2}-\d{2}/, '');
    return `${updatedStr}`
    }
    else{
    return val
    }
    }
    return val
  }


}



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

@Pipe({
  name: 'calculatePipe',
  pure: false
})
export class calculatePipe implements PipeTransform {
  transform(val:any) {  
    

    if(val){
     
      let result = 0;

      val.availdate.forEach((availdate:any)=>{
    
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
    return val
  }


}
