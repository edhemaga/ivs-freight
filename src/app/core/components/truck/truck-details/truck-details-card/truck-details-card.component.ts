import { settings_card_animation } from './../../../settings/settings-shared/settings-animation/settings-card.animation';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-truck-details-card',
  templateUrl: './truck-details-card.component.html',
  styleUrls: ['./truck-details-card.component.scss'],
  animations: [settings_card_animation('openCloseBodyCard')],
})
export class TruckDetailsCardComponent implements OnInit {
  @Input() cardTemplate: string = null;
  @Input() cardName: string = null;
  @Input() cardCount: string = null;
  @Input() cardImg: string = '';
  @Input() data: any = null;
  @Input() hasLine: boolean = true;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptionsSecond: Partial<ChartOptions>;

  public isCardOpen: boolean = true;
  public accountText: string = null;

  public selectedValueFuel:string="";
  public selectedValuePerfomance:string="";
  public selectedValueRevenue:string="";

  constructor() {
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
        height: 300,
        type: "line"
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
        height: 300,
        type: "line"
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

  }

  ngOnInit(): void {
    this.selectedValuePerfomance="ALL";
    this.selectedValueFuel="1Y";
    this.selectedValueRevenue="1Y";

  }

  public onCardOpen() {
    this.isCardOpen = !this.isCardOpen;
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

}
