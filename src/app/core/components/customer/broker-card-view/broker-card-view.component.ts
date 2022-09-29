import { BrokerResponse } from 'appcoretruckassist';
import { BrokerMinimalListQuery } from './../state/broker-details-state/broker-minimal-list-state/broker-minimal.query';
import { BrokerDetailsQuery } from './../state/broker-details-state/broker-details.query';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BrokerQuery } from '../state/broker-state/broker.query';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';

@Component({
  selector: 'app-broker-card-view',
  templateUrl: './broker-card-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./broker-card-view.component.scss'],
})
export class BrokerCardViewComponent implements OnInit, OnChanges {
  @ViewChild('mileageChart', { static: false }) public mileageChart: any;
  @ViewChild('paymentChart', { static: false }) public paymentChart: any;
  @Input() broker: any;
  @Input() templateCard: boolean;
  public brokerDropdowns: any[] = [];
  public brokerList: any[] = this.brokerMinimalQuery.getAll();
  public note: FormControl = new FormControl();
  public tabsBroker: any;
  public invoiceAgeingCounter: number = 0;
  public getPercntageOfPaid: number = 0;

  public mileageChartConfig: any = {
    dataProperties: [
      {
        defaultConfig: {
          type: 'line',
          data: [2.25, 2.5, 2.2, 1.6, 2.2, 2.3],
          label: 'Salary',
          yAxisID: 'y-axis-0',
          borderColor: '#6D82C7',
          pointBackgroundColor: '#FFFFFF',
          pointHoverBackgroundColor: '#6D82C7',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
        },
      },
      {
        defaultConfig: {
          type: 'bar',
          data: [
            [2.7, 1.8],
            [2.8, 2.2],
            [2.7, 1.7],
            [2.1, 1.2],
            [2.7, 1.6],
            [2.6, 2.0],
          ],
          label: 'Miles',
          yAxisID: 'y-axis-0',
          borderColor: '#FFCC80',
          backgroundColor: '#FFCC80',
          hoverBackgroundColor: '#FFA726',
          hasGradiendBackground: true,
          colors: ['rgba(128, 203, 186, 1)', 'rgba(255, 204, 128, 1)'],
          hoverColors: ['rgba(38, 166, 144, 1)', 'rgba(255, 167, 38, 1)'],
          maxBarThickness: 18,
        },
      },
    ],
    showLegend: false,
    chartValues: [46755, 36854],
    defaultType: 'bar',
    chartWidth: '417',
    chartHeight: '130',
    onHoverAnnotation: true,
    offset: true,
    hoverTimeDisplay: true,
    allowAnimation: true,
    animationOnlyOnLoad: true,
    dataLabels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    noChartImage: 'assets/svg/common/mixed_no_data.svg',
  };

  public mileageBarAxes: object = {
    verticalLeftAxes: {
      visible: true,
      minValue: 1,
      maxValue: 3,
      stepSize: 0.5,
      showGridLines: true,
      decimal: true,
    },
    horizontalAxes: {
      visible: true,
      position: 'bottom',
      showGridLines: false,
    },
  };

  public mileageBarChartLegend: any[] = [
    {
      title: 'Avg. Rate',
      value: 2.37,
      image: 'assets/svg/common/round_blue.svg',
      prefix: '$',
      elementId: 0,
    },
    {
      title: 'Highest Rate',
      value: 2.86,
      image: 'assets/svg/common/round_green.svg',
      prefix: '$',
      elementId: [1, 0],
    },
    {
      title: 'Lowest Rate',
      value: 1.29,
      image: 'assets/svg/common/round_yellow.svg',
      prefix: '$',
      elementId: [1, 1],
    },
  ];

  public paymentChartConfig: any = {
    dataProperties: [
      {
        defaultConfig: {
          type: 'line',
          data: [12, 21, 27, 37, 28, 25, 21, 10, 15, 45, 27, 46, 41, 28, 24],
          yAxisID: 'y-axis-0',
          borderColor: '#6D82C7',
          pointBackgroundColor: '#FFFFFF',
          pointHoverBackgroundColor: '#6D82C7',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          fill: true,
          hasGradiendBackground: true,
          colors: ['rgba(189, 202, 235, 1)', 'rgba(255, 255, 255, 1)'],
        },
      },
    ],
    showLegend: false,
    chartValues: [2, 2],
    defaultType: 'bar',
    chartWidth: '417',
    chartHeight: '130',
    annotation: 28,
    onHoverAnnotation: true,
    hoverTimeDisplay: true,
    allowAnimation: true,
    animationOnlyOnLoad: true,
    dataLabels: [
      'JUL',
      '',
      '',
      '',
      '',
      '',
      '',
      'AUG',
      '',
      '',
      '',
      '',
      '',
      '',
      'SEP',
    ],
    noChartImage: 'assets/svg/common/no_data_pay.svg',
  };

  public paymentChartLegend: any[] = [
    {
      title: 'Avg. Pay Period',
      value: 27,
      image: 'assets/svg/common/round_blue_red.svg',
      sufix: 'days',
      elementId: 0,
      titleReplace: 'Pay Period',
      imageReplace: 'assets/svg/common/round_blue.svg',
    },
    {
      title: 'Pay Term',
      value: 32,
      image: 'assets/svg/common/dash_line.svg',
      sufix: 'days',
    },
  ];

  public paymentAxes: object = {
    verticalLeftAxes: {
      visible: true,
      minValue: 0,
      maxValue: 52,
      stepSize: 13,
      showGridLines: true,
    },
    horizontalAxes: {
      visible: true,
      position: 'bottom',
      showGridLines: false,
    },
  };

  constructor(
    private brokerQuery: BrokerQuery,
    private brokerMinimalQuery: BrokerMinimalListQuery,
    private detailsPageDriverSer: DetailsPageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.broker?.currentValue != changes.broker?.previousValue) {
      this.note.patchValue(changes.broker.currentValue.note);
      this.getBrokerDropdown();
      this.getInvoiceAgeingCount(changes.broker.currentValue);
    }
  }
  ngOnInit(): void {
    this.tabsButton();
  }
  public tabsButton() {
    this.tabsBroker = [
      {
        id: 223,
        name: '1M',
      },
      {
        name: '3M',
        checked: false,
      },
      {
        id: 412,
        name: '6M',
        checked: false,
      },
      {
        id: 515,
        name: '1Y',
        checked: false,
      },
      {
        id: 1210,
        name: 'YTD',
        checked: false,
      },
      {
        id: 1011,
        name: 'ALL',
        checked: false,
      },
    ];
  }

  public getInvoiceAgeingCount(data: BrokerResponse) {
    this.getPercntageOfPaid = (data?.availableCredit / data?.creditLimit) * 100;

    let firstGroup = data?.invoiceAgeingGroupOne?.countInvoice;
    let secondGroup = data?.invoiceAgeingGroupTwo?.countInvoice;
    let threeGroup = data?.invoiceAgeingGroupThree?.countInvoice;
    let fourGroup = data?.invoiceAgeingGroupFour?.countInvoice;
    this.invoiceAgeingCounter =
      firstGroup + secondGroup + threeGroup + fourGroup;
  }

  public getBrokerDropdown() {
    this.brokerDropdowns = this.brokerQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.businessName,
        status: item.status,
        active: item.id === this.broker.id,
      };
    });
  }
  public onSelectBroker(event: any) {
    if (event.id !== this.broker.id) {
      this.brokerList = this.brokerQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.businessName,
          status: item.status,
          active: item.id === event.id,
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }

  public onChangeBroker(action: string) {
    let currentIndex = this.brokerList.findIndex(
      (brokerId) => brokerId.id === this.broker.id
    );

    switch (action) {
      case 'previous': {
        currentIndex = --currentIndex;
        if (currentIndex != -1) {
          this.detailsPageDriverSer.getDataDetailId(
            this.brokerList[currentIndex].id
          );
          this.onSelectBroker({ id: this.brokerList[currentIndex].id });
        }
        break;
      }
      case 'next': {
        currentIndex = ++currentIndex;
        if (currentIndex !== -1 && this.brokerList.length > currentIndex) {
          this.detailsPageDriverSer.getDataDetailId(
            this.brokerList[currentIndex].id
          );
          this.onSelectBroker({ id: this.brokerList[currentIndex].id });
        }
        break;
      }

      default: {
        break;
      }
    }
  }
}
