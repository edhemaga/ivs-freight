import { Subject } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { FormControl } from '@angular/forms';
import { truck_details_animation } from './../truck-details.animation';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from 'ng-apexcharts';
import moment from 'moment';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any;
  dataLabels: any;
  fill: ApexFill;
  tooltip: ApexTooltip;
};
@Component({
  selector: 'app-truck-details-item',
  templateUrl: './truck-details-item.component.html',
  styleUrls: ['./truck-details-item.component.scss'],
  encapsulation:ViewEncapsulation.None,
  animations:[truck_details_animation('showHideDetails')]
})
export class TruckDetailsItemComponent implements OnInit {
  @ViewChild('autosize',{static:false}) autosize:CdkTextareaAutosize;
  @Input() data:any=null;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptionsSecond: Partial<ChartOptions>;

  public fhwaNote:FormControl=new FormControl();
  public purchaseNote:FormControl=new FormControl();
   
  private destory$:Subject<void>=new Subject<void>();
  public selectedValueFuel:string="";
  public selectedValuePerfomance:string="";
  public selectedValueRevenue:string="";
  public toggler:boolean=false;

  isAccountVisible:boolean=true;
  accountText:string=null;
  cardNumberFake:string='0000000006213';
  constructor( private customModalService:CustomModalService) {
      
    this.chartOptionsSecond={
      
      series: [
        {
          name: "Miles",
          type: "column",
          data: [5,10,15,20,25,30,35,45,60],
          color:"#B2DFD1",
        },
        {
          name: "Revenue",
          type: "line",
          data: [23, 2.000, 3.000, 5.000, 6.000,7.000 , 11.000, 18.000, 23.000],
          color:"#6d82c7"
        }
      ],
      chart: {
        height: 180,
        width:408,
        type: "line",
        zoom:{
         enabled:false
        }
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: ""
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["NOV", "2021",  "MAR",  "APR",  "MAY",  "JUN",  "JUL",  "AUG", "SEP","OCT","DEC","FEB"],
        labels:{
          
          show:true,
          style:{
            colors:'#AAAAAA',
            fontSize:'11px',
            fontWeight:'700'
          }
        }
        
      },
      yaxis: [
        
        {
          tickAmount:5,
          labels:{
            show:true,
            style:{
              colors:'#AAAAAA',
              fontSize:'11px',
              fontWeight:'700'
            },
           
          }
          
        },
        
        {
          opposite: true,
          tickAmount:5,
          labels:{
            show:true,
            style:{
              colors:'#AAAAAA',
              fontSize:'11px',
              fontWeight:'700'
            },
            formatter:function(val){
              val.toFixed(2);
              return val.toFixed(0) + "K"
            }
          }
        }
      ],
    };


    this.chartOptions = {
      
      series: [
        {
          name: "Miles per Gallon",
          type: "column",
          data: [5,10,15,20,25,30,35,45,60],
          color:"#ffcc80",
  
        },
        {
          name: "Cost per Gallon",
          type: "line",
          data: [23, 2.000, 3.000, 5.000, 6.000,7.000 , 11.000, 18.000, 23.000],
          color:"#6d82c7"
        }
      ],
      chart: {
        height: 180,
        width:408,
        type: "line",
        zoom:{
          enabled:false
         }
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: ""
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["NOV", "2021","MAR","MAY","JUL", "SEP"],
        labels:{
          
          show:true,
          style:{
            colors:'#AAAAAA',
            fontSize:'11px',
            fontWeight:'700'
          }
        }
        
      },
      yaxis: [
        {
          tickAmount:5,
          labels:{
            show:true,
            style:{
              colors:'#AAAAAA',
              fontSize:'11px',
              fontWeight:'700'
            },
           
          }
          
        },
        
        {
          opposite: true,
          tickAmount:5,
          labels:{
            show:true,
            style:{
              colors:'#AAAAAA',
              fontSize:'11px',
              fontWeight:'700'
            },
            formatter:function(val){
              val.toFixed(2);
              return val.toFixed(0) + "K"
            }
          }
        }
      ],
      
    };


   }
  
  ngOnInit(): void {
    this.selectedValuePerfomance="ALL";
    this.selectedValueFuel="1Y";
    this.selectedValueRevenue="1Y";
    
  }
  ngOnDestroy():void{
    this.destory$.next();
    this.destory$.complete();
  }

  public onShowDetails(componentData:any){
    componentData.showDetails=!componentData.showDetails
  }
  
  public onModalAction(){
    
  }
  public formatDate(date:string){
    return moment(date).format('MM/DD/YY');
  }

  public formatText(data:any, type:boolean, numOfCharacters:string){
    if(!type){
      return data.map((item)=>
         item.endorsementName?.substring(0, numOfCharacters)
      )
    }
    return data.map((item)=> `<span class='first-character'>
    ${item.endorsmentName?.substring(0,numOfCharacters)}</span> ` + item.endorsementName.substring(0, numOfCharacters))
  }
   
  public identity(index:number,item:any):number{
    return item.id;
  }

  public changeValuePerfomance(val: string) {
    this.selectedValuePerfomance=val;
    console.log(val + " Perfomance");
  }

  public changeValueFuel(val:string){
    this.selectedValueFuel=val;
    console.log(val + " FUEL");
  }
  public changeValueRevenue(val:string){
    this.selectedValueRevenue=val;
    console.log(val + " Revenue");
  }

  public toggleResizePage(value:boolean){
    this.toggler=value;
    console.log(this.toggler); 
  }

  public onFileAction(action: string) {
    switch (action) {
      case 'download': {
        this.downloadFile('https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf', 'truckassist0');
        break;
      }
      default: {
        break;
      }
    }
  }
  public downloadFile(url: string, filename: string) {
    fetch(url).then((t) => {
      return t.blob().then((b) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.setAttribute('download', filename);
        a.click();
      });
    });
  }
  
  public hiddenPassword(value:any, numberOfCharacterToHide:number){
    const lastFourCharaters=value.substring(
      value.length-numberOfCharacterToHide
    );
    let hiddenCharacter='';

    for(let i=0; i<numberOfCharacterToHide; i++){
      hiddenCharacter+="*";
    }
    return hiddenCharacter + lastFourCharaters;
  }

  public showHideValue(value:string){
    this.isAccountVisible= !this.isAccountVisible;
    if(!this.isAccountVisible){
      this.accountText=this.hiddenPassword(value,4);
      return;
    }
    this.accountText=value;
  }
}
