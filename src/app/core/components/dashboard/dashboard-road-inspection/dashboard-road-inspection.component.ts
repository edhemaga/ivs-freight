import {Component, OnInit, ViewChild} from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-dashboard-road-inspection',
  templateUrl: './dashboard-road-inspection.component.html',
  styleUrls: ['./dashboard-road-inspection.component.scss']
})
export class DashboardRoadInspectionComponent implements OnInit {
  @ViewChild('chart') chart: any;
  hoveredItemTip: any = [];
  hoveredItemTipSave: any = [];
  switchData: any = [
    {
      id: 'measuere',
      name: 'Carrier Measure',
      checked: false,
    },
    {
      id: 'inspection',
      name: 'Inspection',
      checked: true,
    },
  ];
  inspections: any[] = [
    {
      name: "Unsafe <br/> Driving",
      image: "unsafe"
    },
    {
      name: "Crash <br/> Indicator",
      image: "crash-indicator",
      active: true
    },
    {
      name: "HOS <br/> Compl",
      image: "hos"
    },
    {
      name: "Vehicle <br/> Maint",
      image: "maintance"
    },
    {
      name: "Cont. SAS <br/> & ALC",
      image: "alc"
    },
    {
      name: "HazMat <br/> Compl",
      image: "hazmat"
    },
    {
      name: "Driver <br/> Fitness",
      image: "fitness"
    }
  ];
  type = 'bubble';
  data: any = {
    hover: {
      intersect: false
    },
    labels: [['02', '26', '21'], ['02', '27', '21'], ['02', '28', '21'], ['02', '29', '21'], ['02', '30', '21'], ['02', '31', '21']],
    datasets: [
      {
        data: [{y: 15, value: '1.63'}, {y: 5, value: '1.44'}, {y: 8, value: '1.24'}, {y: 1, value: '1.16%'}, {
          y: 15,
          value: '1.57%'
        }, {y: 15, value: '1.54'}],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#5673AAb3',
        pointBorderColor: '#5673AAb3',
        pointBackgroundColor: '#fff',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        pointRadius: 20,
        pointHoverRadius: 20,
        borderWidth: 2,
        hoverBorderWidth: 2,
        datalabels: {
          align: 'center',
          anchor: 'center',
          font: {
            weight: 'bold'
          },
          formatter(value, context) {
            return context.dataset.data[context.dataIndex].value;
          },
          listeners: {
            enter: function (context) {
              // Receives `enter` events for any labels of any dataset. Indices of the
              // clicked label are: `context.datasetIndex` and `context.dataIndex`.
              // For example, we can modify keep track of the hovered state and
              // return `true` to update the label and re-render the chart.
              context.hovered = true;
              return true;
            },
            leave: function (context) {
              // Receives `leave` events for any labels of any dataset.
              context.hovered = false;
              return true;
            }
          },
          color(context) {
            return context.hovered ? "#fff" : "#5673AAb3";
          }
        }
      }
    ]
  };
  options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          min: 1,
          max: 20,
          stepSize: 1,
        },
        gridLines: {
          display: false
        }
      }],
      xAxes: [{
        ticks: {
          fontSize: 12,
          padding: 30,
          min: 10,
          max: 6,
          stepSize: 1,
          fontColor: '#91A4C7',
          fontWeight: 20,
          lineHeight: 1.4,
          callback: (value, index, values) => {
            // if ( (index == 0 || index == (values.length - 1) && this.hoveredItemTip?.join('') == value.join(','))) { return "02/28/21"; }
            // else if (this.hoveredItemTip?.join('') == value.join(',')) { return value.join("/"); }

            if (index == 0 || index == (values.length - 1) || this.hoveredItemTip?.join('') == values.join(',')) {
              return values.join("/");
            }
          },
        },
        gridLines: {
          display: false
        }
      }]
    },
    legend: {
      display: false
    },
    plugins: {
      legend: {
        display: false,
      }
    },
    tooltips: {
      enabled: false,
      yAlign: 'top',
      mode: 'x-axis',
      position: 'average',
      intersect: false,
      custom: (tooltipModel) => {
        this.hoveredItemTip = tooltipModel.title;

        if (this.hoveredItemTipSave?.join('') != this.hoveredItemTip?.join('')) {
          this.chart.chart.chart.update();
          this.hoveredItemTipSave = this.hoveredItemTip;
        }

      }
    }
  };

  constructor() {
  }

  ngOnInit(): void {
    Chart.plugins.register(ChartDataLabels);
    this.drawGraphLine();
  }

  public drawGraphLine() {
    Chart.defaults.LineWithDottedLine = Chart.defaults.line;
    Chart.controllers.LineWithDottedLine = Chart.controllers.line.extend({
      draw(ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
          const activePoint = this.chart.tooltip._active[0],
            ctx = this.chart.ctx,
            x = activePoint.tooltipPosition().x,
            y = activePoint.tooltipPosition().y,
            topY = this.chart.legend.bottom,
            bottomY = this.chart.chartArea.bottom + 38;
          // draw line
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([2, 3]);
          ctx.moveTo(x, y);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = '#5673AA70';
          ctx.stroke();
          ctx.restore();
        }
      }
    });
  }

}
