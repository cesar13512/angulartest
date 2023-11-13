
  import { Component } from '@angular/core';
  import { ApiService } from '../../../core/models/services/api.service'; 
  import { FormBuilder } from '@angular/forms';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

  import { ChartConfiguration, ChartOptions } from 'chart.js';
  import { forkJoin, map } from 'rxjs';
     
  @Component({
    selector: 'app-page',
    templateUrl: './landing.component.html'
  })
  export class landingDashboard {
  




  
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: false,
  };


  public pieChartOptions: ChartOptions<'pie'> = {
  responsive: false,
  };

  public pieChartLabels = [ [ 'Admin'], [ 'Member' ], ['Product'], 'Supplier'];

  public pieChartDatasets = [ {
  data: []
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public piechart = false




  public lineChartData: ChartConfiguration<'line'>['data'] = {
  labels: [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July'
   ],
   datasets: [
   {
    data: [ 65, 59, 80, 81, 56, 55, 40 ],
    label: 'Series A',
    fill: true,
    tension: 0.5,
    borderColor: 'black',
    backgroundColor: 'rgba(255,0,0,0.3)'
    }
    ]
    };
    public lineChartOptions: ChartOptions<'line'> = {
      responsive: false
    };
    public lineChartLegend = true;

    
    
  constructor(
  private apiservice   : ApiService, 
  private formBuilder  : FormBuilder,  
  public modalService  : NgbModal,
  ){
  
  }
 
  ngOnInit() {
    //  forkJoin([

    //   this.apiservice.getRequest("account/findall").pipe(
    //   map((data)=>{ 
    
    //    let datax = {admin : 0, member:0, supplier:0}
    //    data.data.map((i:any) =>{
    //       if(i.role === 'ADMIN'){
    //       datax.admin++
    //       }
    //       if(i.role === 'MEMBER'){
    //       datax.member++
    //       }
    //       if(i.role === 'SUPPLIER'){
    //       datax.supplier++
    //       }
    //       })
    //       return datax;
          
    //       })
       
    //     ),
    
    //     this.apiservice.getRequest("quatation").pipe(
    //     map((data)=>{ 
            
    //      let datax = {product : 0}
    //      data.map((i:any) =>{
    //      datax.product++
    //      })
    //      return datax;
            
    //      })
         
    //       )
    // ]).subscribe((res:any)=>{
    // let res1 = res[0];
    // let res2 = res[1];
    // let obj  = {...res1,...res2}
    // let arr  : any = []
    // Object.keys(obj).forEach(function (key) {
    //   var val = obj[key];
    //   arr.push(val)
    //  });
    // this.pieChartDatasets[0].data = arr
    // this.piechart = true

    // })
   
   
  }
  }