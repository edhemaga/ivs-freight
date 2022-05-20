import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import moment from 'moment';
import { Subject } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { driver_details_animation } from '../driver-details.animation';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { DriversQuery } from '../../state/driver.query';
import { ActivatedRoute } from '@angular/router';
import { DriverTService } from '../../state/driver.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  selector: 'app-driver-details-item',
  templateUrl: './driver-details-item.component.html',
  styleUrls: ['./driver-details-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [driver_details_animation('showHideDetails')],
})
export class DriverDetailsItemComponent implements OnInit, OnDestroy {
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() data: any = null;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public cdlNote: FormControl = new FormControl();
  public mvrNote: FormControl = new FormControl();
  public toggler: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public selectedValuePayroll: string = '';
  public copiedPhone: boolean = false;
  public copiedBankRouting: boolean = false;
  public copiedBankAccount: boolean = false;
  public copiedEin: boolean = false;
  public copiedSSN: boolean = false;
  public copiedDriverPhone: boolean = false;
  public copiedDriverEmail: boolean = false;

  public isAccountVisible: boolean = true;
  public accountText: string = null;
  public arrayDrivers: any = [];
  public arrayDriverName: any = '';
  public currentDriverName: string = 'Milos Cirkovic';
  public driverId: number = 0;
  public showMoreEmployment: boolean = false;
  public employmentHistory: any = [];
  dataTest: any;
  public buttonsArray: any;
  public driverData: any;
  public driverImage: string;
  constructor(
    private activated_route: ActivatedRoute,
    private sanitazer: DomSanitizer
  ) {
    this.arrayDrivers = [
      {
        id: 1,
        name: 'Angela Martin',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 2,
        name: 'Angela Lomarion',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 3,
        name: 'Denis Rodmar',
        svg: null,
        folder: null,
      },
      {
        id: 4,
        name: 'Milos Cirkovic',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 5,
        name: 'Aleksandar Djordjevic',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 6,
        name: 'Mika Mikic',
        svg: null,
        folder: null,
      },
      {
        id: 7,
        name: 'Denis Rodmar',
        svg: null,
        folder: null,
      },
      {
        id: 8,
        name: 'Milos Cirkovic',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 9,
        name: 'Aleksandar Djordjevic',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 10,
        name: 'Mika Mikic',
        svg: null,
        folder: null,
      },
    ];

    this.chartOptions = {
      series: [
        {
          name: 'Miles per Gallon',
          type: 'column',
          data: [5, 10, 15, 20, 25, 30, 35, 45, 60],
          color: '#ffcc80',
        },
        {
          name: 'Cost per Gallon',
          type: 'line',
          data: [23, 2.0, 3.0, 5.0, 6.0, 7.0, 11.0, 18.0, 23.0],
          color: '#6d82c7',
        },
      ],
      chart: {
        height: 180,
        width: 415,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: '',
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          'NOV',
          '2021',
          'MAR',
          'MAY',
          'JUL',
          'SEP',
          'NOV',
          '2021',
          'MAR',
          'MAY',
          'JUL',
          'SEP',
        ],
        labels: {
          show: true,
          style: {
            colors: '#AAAAAA',
            fontSize: '11px',
            fontWeight: '700',
          },
        },
      },
      yaxis: [
        {
          tickAmount: 5,
          labels: {
            show: true,
            style: {
              colors: '#AAAAAA',
              fontSize: '11px',
              fontWeight: '700',
            },
          },
        },

        {
          opposite: true,
          tickAmount: 5,
          labels: {
            show: true,
            style: {
              colors: '#AAAAAA',
              fontSize: '11px',
              fontWeight: '700',
            },
            formatter: function (val) {
              val.toFixed(2);
              return val.toFixed(0) + 'K';
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    console.log(this.data);
    this.selectedValuePayroll = '1Y';
    this.initTableOptions();
    this.getDriversList();
    this.getEmploymentHistory();
    this.getDriverById();
    this.buttonsArray = [
      {
        label: '1M',
        value: '1M',
        name: 'chart',
        checked: false,
      },
      {
        label: '3M',
        value: '3M',
        name: 'chart',
        checked: false,
      },
      {
        label: '6M',
        value: '6M',
        name: 'chart',
        checked: false,
      },
      {
        label: '1Y',
        value: '1Y',
        name: 'chart',
        checked: false,
      },
      {
        label: 'YTD',
        value: 'YTD',
        name: 'chart',
        checked: false,
      },
      {
        label: 'ALL',
        value: 'ALL',
        name: 'chart',
        checked: true,
      },
    ];
  }

  public transformImage() {
    if (this.driverData.driver.avatar) {
      this.driverImage = 'data:image/*;base64,' + this.driverData.driver.avatar;
    } else {
      this.driverImage = 'assets/svg/common/ic_no_avatar_driver.svg';
    }
    return this.sanitazer.bypassSecurityTrustResourceUrl(this.driverImage);
  }

  public getEmploymentHistory() {
    this.employmentHistory = [
      {
        status: 'Employed',
        fromTo: '08/10/21 - 04/23/22',
        duration: '0y 204 d',
        svgIcon: 'assets/svg/common/round_blue.svg',
        hasDivider: true,
      },
      {
        status: 'Deactivated',
        fromTo: '04/24/22 - 07/05/23',
        duration: '1y 103 d',
        svgIcon: 'assets/svg/common/ic_circle_light_blue.svg',
        hasDivider: true,
      },
      {
        status: 'Employed',
        fromTo: '07/06/23 - 07/21/24',
        duration: '1y 16 d',
        svgIcon: 'assets/svg/common/round_blue.svg',
        hasDivider: true,
      },
      {
        status: 'Deactivated',
        fromTo: '07/22/24 - 09/04/24',
        duration: '0y 53 d',
        svgIcon: 'assets/svg/common/ic_circle_light_blue.svg',
        hasDivider: true,
      },
      {
        status: 'Employed',
        fromTo: '09/05/24 - Today',
        duration: '0y 247 d',
        svgIcon: 'assets/svg/common/round_blue.svg',
        hasDivider: false,
      },
    ];
  }

  public getDriverById() {
    this.driverData = this.activated_route.snapshot.data;
  }
  public getDriversList() {
    for (let i = 0; i < this.arrayDrivers.length; i++) {
      this.arrayDrivers[i];
    }
    this.arrayDriverName =
      this.arrayDrivers[Object.keys(this.arrayDrivers)[this.driverId]];
    return this.arrayDrivers;
  }

  public nextDriver() {
    this.driverId < this.arrayDrivers.length - 1
      ? this.driverId++
      : (this.driverId = 0);
    console.log(this.driverId);
    this.arrayDriverName =
      this.arrayDrivers[Object.keys(this.arrayDrivers)[this.driverId]];
    console.log(this.arrayDrivers.length);
  }

  public previousDriver() {
    this.driverId < 1
      ? (this.driverId = this.arrayDrivers.length)
      : this.driverId--;
    console.log(this.driverId);
    this.arrayDriverName =
      this.arrayDrivers[Object.keys(this.arrayDrivers)[this.driverId]];
  }

  public initTableOptions(): void {
    this.dataTest = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      actions: [
        {
          title: 'Edit',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },

        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  public onModalAction() {
    // const data = {
    //   type: 'new',
    //   vehicle: 'truck',
    // };
    // switch (this.data.template) {
    //   case 'cdl': {
    //     this.customModalService.openModal(
    //       DriverCdlModalComponent,
    //       { data },
    //       null,
    //       { size: 'small' }
    //     );
    //     break;
    //   }
    //   case 'drugAlcohol': {
    //     this.customModalService.openModal(
    //       DriverDrugAlcoholModalComponent,
    //       { data },
    //       null,
    //       { size: 'small' }
    //     );
    //     break;
    //   }
    //   case 'medical': {
    //     this.customModalService.openModal(
    //       DriverMedicalModalComponent,
    //       { data },
    //       null,
    //       { size: 'small' }
    //     );
    //     break;
    //   }
    //   case 'mvr': {
    //     this.customModalService.openModal(
    //       DriverMvrModalComponent,
    //       { data },
    //       null,
    //       { size: 'small' }
    //     );
    //     break;
    //   }
    //   default: {
    //     break;
    //   }
    // }
  }

  public onButtonAction(data: { template: string; action: string }) {
    switch (data.template) {
      case 'cdl': {
        if (data.action === 'attachments') {
          // TODO: attachments
        } else if (data.action === 'notes') {
          // TODO: notes
        } else {
          // TODO: dots
        }
        break;
      }
    }
  }

  public onShowDetails(componentData: any) {
    componentData.showDetails = !componentData.showDetails;
  }

  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
  public formatPhone(phoneNumberString: string) {
    const value = phoneNumberString;
    const number = value?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    phoneNumberString = number;
    return number;
  }

  public formatHistoryDays(workDate: string) {
    const dateB = moment(workDate);
    const dateC = moment().format();
    const year = dateB.diff(dateC, 'year');
    const days = dateB.diff(dateC, 'days');
    console.log(year);
  }

  public formatText(data: any, type: boolean, numOfCharacters: string) {
    if (!type) {
      return data.map((item) =>
        item.endorsementName?.substring(0, numOfCharacters)
      );
    }
    return data.map(
      (item) =>
        `<span class='first-character'>${item.endorsementName?.substring(
          0,
          numOfCharacters
        )}</span>` + item.endorsementName.substring(numOfCharacters)
    );
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  public toggleResizePage(value: boolean) {
    this.toggler = value;
    console.log(this.toggler);
  }
  public changeValuePayroll(val: string) {
    this.selectedValuePayroll = val;
    console.log(val + ' Payroll');
  }
  public onFileAction(action: string) {
    switch (action) {
      case 'download': {
        this.downloadFile(
          'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf',
          'truckassist0'
        );
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
  /* To copy any Text */
  public copyText(val: any, copVal: string) {
    switch (copVal) {
      case 'phone':
        this.copiedPhone = true;
        break;

      case 'bankAcc':
        this.copiedBankAccount = true;
        break;

      case 'bankRouting':
        this.copiedBankRouting = true;
        break;

      case 'ein':
        this.copiedEin = true;
        break;

      case 'ssn':
        this.copiedSSN = true;
        break;

      case 'driver-phone':
        this.copiedDriverPhone = true;
        break;
      case 'driver-email':
        this.copiedDriverEmail = true;
        break;
    }

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public hiddenPassword(value: any, numberOfCharacterToHide: number): string {
    const lastFourCharaters = value.substring(
      value.length - numberOfCharacterToHide
    );
    let hiddenCharacter = '';

    for (let i = 0; i < numberOfCharacterToHide; i++) {
      hiddenCharacter += '*';
    }
    return hiddenCharacter + lastFourCharaters;
  }

  public showHideValue(value: string) {
    this.isAccountVisible = !this.isAccountVisible;
    if (!this.isAccountVisible) {
      this.accountText = this.hiddenPassword(value, 4);
      return;
    }
    this.accountText = value;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
