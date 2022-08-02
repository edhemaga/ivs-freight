import { SumArraysPipe } from './../../../pipes/sum-arrays.pipe';
import { card_component_animation } from './../../shared/animations/card-component.animations';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DriverResponse } from 'appcoretruckassist';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverCdlModalComponent } from '../driver-details/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../driver-details/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../driver-details/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../driver-details/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import moment from 'moment';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DriversMinimalListQuery } from '../state/driver-details-minimal-list-state/driver-minimal-list.query';
@Component({
  selector: 'app-driver-details-card',
  templateUrl: './driver-details-card.component.html',
  styleUrls: ['./driver-details-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
  providers: [SumArraysPipe],
})
export class DriverDetailsCardComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() driver: any;
  @Input() templateCard: boolean;
  public note: FormControl = new FormControl();
  public isAccountVisibleDriver: boolean = false;
  public toggler: boolean[] = [];
  public dataTest: any;
  public selectedTab: number;
  public yearsService: number = 0;
  public daysService: number = 0;
  public activePercentage: number = 0;
  public firstDate: any;
  public lastDate: any;
  public deactivatePeriod: boolean;
  public tooltipData: any;
  public tooltipFormatStartDate: any;
  public tooltipFormatEndDate: any;
  public showTooltip: boolean;
  public tabsDriver: any[] = [];
  public cdlNote1: FormControl = new FormControl();
  public mvrNote: FormControl = new FormControl();
  public dropData: any;
  public dataProggress: any;
  public hideArrow: boolean;
  public expDateCard: boolean;
  // Driver Dropdown
  public driversDropdowns: any[] = [];
  public driversList: any[] = this.driverMinimalQuery.getAll();
  public dataCDl: any;

  public driverOwner: boolean;
  public barChartLegend: any[] = [
    {
      title: 'Miles',
      value: 46755,
      image: 'assets/svg/common/round_yellow.svg',
      sufix: 'mi',
      elementId: 1,
    },
    {
      title: 'Salary',
      value: 36854,
      image: 'assets/svg/common/round_blue.svg',
      prefix: '$',
      elementId: 0,
    },
  ];

  public barAxes: object = {
    verticalLeftAxes: {
      visible: true,
      minValue: 0,
      maxValue: 4000,
      stepSize: 1000,
      showGridLines: true,
    },
    verticalRightAxes: {
      visible: true,
      minValue: 0,
      maxValue: 2800,
      stepSize: 700,
      showGridLines: false,
    },
    horizontalAxes: {
      visible: true,
      position: 'bottom',
      showGridLines: false,
    },
  };

  constructor(
    private modalService: ModalService,
    private detailsPageDriverSer: DetailsPageService,
    private sumArr: SumArraysPipe,
    private clipboar: Clipboard,
    private cdRef: ChangeDetectorRef,
    private tableService: TruckassistTableService,
    private driverMinimalQuery: DriversMinimalListQuery,
    private imageBase64Service: ImageBase64Service
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.driver?.firstChange && changes?.driver) {
      this.note.patchValue(changes.driver.currentValue.note);
      this.getExpireDate(changes.driver.currentValue);
      this.getYearsAndDays(changes.driver.currentValue);
      this.widthOfProgress();
      this.getDriversDropdown();
    }
    if (changes?.driver?.firstChange) {
      if (this.templateCard == true) {
        this.hideArrow = true;
      } else {
        this.hideArrow = false;
      }
    }
  }

  ngOnInit(): void {
    this.note.patchValue(this.driver.note);
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res.animation) {
          this.driver = res.data;
          this.getExpireDate(res.data);
          this.cdRef.detectChanges();
        }
      });
    if (this.templateCard == true) {
      this.hideArrow = true;
    } else {
      this.hideArrow = false;
    }
    this.initTableOptions();
    this.initTableOptionsCard(this.driver);
    this.getDriversDropdown();
    this.tabsButton();
    this.getYearsAndDays(this.driver);
    this.widthOfProgress();
    this.getExpireDate(this.driver);
  }

  /**Function return user image if have in DB or default image */
  public transformImage() {
    return this.imageBase64Service.sanitizer(
      this.driver.avatar
        ? this.driver.avatar
        : 'assets/svg/common/ic_no_avatar_driver.svg'
    );
  }

  public tabsButton() {
    this.tabsDriver = [
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
  /**Function for toggle page in cards */
  public toggleResizePage(value: number, indexName: string) {
    this.toggler[value + indexName] = !this.toggler[value + indexName];
  }
  public changeTab(ev: any) {
    this.selectedTab = ev.id;
  }

  public optionsEvent(any: any, action: string) {
    switch (action) {
      case 'edit-licence': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driver.id,
            type: action,
          }
        );
        break;
      }
      case 'edit-drug': {
        this.modalService.openModal(
          DriverDrugAlcoholModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driver.id,
            type: action,
          }
        );
        break;
      }
      case 'edit-medical': {
        this.modalService.openModal(
          DriverMedicalModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driver.id,
            type: action,
          }
        );
        break;
      }
      case 'edit-mvr': {
        this.modalService.openModal(
          DriverMvrModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driver.id,
            type: action,
          }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  /**Function retrun id */
  public identity(index: number, item: any): number {
    return index;
  }

  /**Function for dots in cards */
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
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
        },
        {
          title: 'Renew',
          name: 'renew',
          svg: 'assets/svg/common/ic_reload_renew.svg',
          show: true,
        },
        {
          title: 'Void',
          name: 'activate-item',
          svg: 'assets/svg/common/ic_cancel_violation.svg',
          show: true,
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }

  /**Function for dots in cards */
  public initTableOptionsCard(data: DriverResponse): void {
    this.dropData = {
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
          title: 'Send Message',
          name: 'dm',
          svg: 'assets/svg/common/ic_dm.svg',
          show: data.status == 1 ? true : false,
        },
        {
          title: 'Print',
          name: 'print',
          svg: 'assets/svg/common/ic_fax.svg',
          show: data.status == 1 || data.status == 0 ? true : false,
        },

        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: data.status == 1 ? true : false,
        },
        {
          title: data.status == 0 ? 'Activate' : 'Deactivate',
          name: 'deactivate',
          svg: 'assets/svg/common/ic_deactivate.svg',
          activate: data.status == 0 ? true : false,
          deactivate: data.status == 1 ? true : false,
          show: data.status == 1 || data.status == 0 ? true : false,
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: data.status == 1 || data.status == 0 ? true : false,
        },
      ],
      export: true,
    };
  }

  public getExpireDate(data: DriverResponse) {
    this.dataCDl = data.cdls.map((ele) => {
      if (moment(ele.expDate).isBefore(moment())) {
        this.expDateCard = false;
      } else {
        this.expDateCard = true;
      }
      return {
        ...ele,
        showButton: this.expDateCard,
      };
    });
  }

  public onModalAction(action: string): void {
    if (action.includes('Drug')) {
      action = 'DrugAlcohol';
    }
    switch (action) {
      case 'CDL': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          { id: this.driver.id, type: 'new-licence' }
        );
        break;
      }
      case 'DrugAlcohol': {
        this.modalService.openModal(
          DriverDrugAlcoholModalComponent,
          { size: 'small' },
          { id: this.driver.id, type: 'new-drug' }
        );

        break;
      }
      case 'Medical': {
        this.modalService.openModal(
          DriverMedicalModalComponent,
          { size: 'small' },
          { id: this.driver.id, type: 'new-medical' }
        );
        break;
      }
      case 'MVR': {
        this.modalService.openModal(
          DriverMvrModalComponent,
          { size: 'small' },
          { id: this.driver.id, type: 'new-mvr' }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  public widthOfProgress() {
    let arrMinDate = [];
    let arrMaxDate = [];
    let dateDeactivate = [];
    if (this.driver.employmentHistories) {
      const sum = this.sumArr.transform(
        this.driver.employmentHistories.map((item) => {
          return {
            id: item.id,
            value: item.duration.Years * 365.25 + item.duration.Days,
          };
        })
      );
      this.dataProggress = this.driver.employmentHistories.map((element) => {
        let res = element.duration.Years * 365.25 + element.duration.Days;
        this.activePercentage = (res / sum) * 100;
        let dates = moment(element.startDate)
          .min(element.startDate)
          .format('MM/DD/YY');
        let endDate = moment(element.endDate)
          .max(element.endDate)
          .format('MM/DD/YY');
        arrMinDate.push(new Date(dates));
        arrMaxDate.push(new Date(endDate));
        let deactivate = element.isDeactivate;
        dateDeactivate.push(deactivate);
        return {
          ...element,
          activePercentage: this.activePercentage.toFixed(1),
        };
      });

      let dateRes = moment(new Date(Math.min.apply(null, arrMinDate))).format(
        'MM/DD/YY'
      );
      if (dateDeactivate.includes(true)) {
        this.deactivatePeriod = true;
      } else {
        this.deactivatePeriod = false;
      }
      this.firstDate = dateRes;
      if (!arrMaxDate.includes('Invalid Date')) {
        let maxEmpDate = moment(
          new Date(Math.max.apply(null, arrMaxDate))
        ).format('MM/DD/YY');
        this.lastDate = maxEmpDate;
      } else {
        this.lastDate = 'Today';
      }
    }
  }

  public getYearsAndDays(data: any) {
    let sum = 0;
    let sum2 = 0;
    if (data.employmentHistories) {
      data.employmentHistories.forEach((element) => {
        sum += element.duration.Years;
        sum2 += element.duration.Days;
      });
      let sum3 = sum * 365.25 + sum2;
      this.yearsService = Math.trunc(sum3 / 365.25);
      this.daysService = Math.trunc(sum3 % 365.25);
    }
  }
  public mouseEnter(dat: any) {
    this.tooltipData = dat;
    this.tooltipFormatStartDate = moment(
      dat.startDate,
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
    ).format('DD MMMM, YYYY');
    this.tooltipFormatEndDate = moment(
      dat.endDate,
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
    ).format('DD MMMM, YYYY');
    this.showTooltip = true;
  }
  public getDriversDropdown() {
    this.driversDropdowns = this.driverMinimalQuery.getAll().map((item) => {
      let fullname = item.firstName + ' ' + item.lastName;
      return {
        id: item.id,
        name: fullname,
        status: item.status,
        svg: item.owner ? 'driver-owner' : null,
        folder: 'common',
        active: item.id === this.driver.id,
      };
    });
  }

  public onSelectedDriver(event: any) {
    if (event.id !== this.driver.id) {
      this.driversDropdowns = this.driverMinimalQuery.getAll().map((item) => {
        let fullname = item.firstName + ' ' + item.lastName;
        return {
          id: item.id,
          name: fullname,
          status: item.status,
          svg: item.owner ? 'driver-owner' : null,
          folder: 'common',
          active: item.id === event.id,
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }

  public onChangeDriver(action: string) {
    let currentIndex = this.driversList.findIndex(
      (driver) => driver.id === this.driver.id
    );

    switch (action) {
      case 'previous': {
        currentIndex = --currentIndex;
        if (currentIndex != -1) {
          this.detailsPageDriverSer.getDataDetailId(
            this.driversList[currentIndex].id
          );
          this.onSelectedDriver({ id: this.driversList[currentIndex].id });
        }
        break;
      }
      case 'next': {
        currentIndex = ++currentIndex;
        if (currentIndex !== -1 && this.driversList.length > currentIndex) {
          this.detailsPageDriverSer.getDataDetailId(
            this.driversList[currentIndex].id
          );
          this.onSelectedDriver({ id: this.driversList[currentIndex].id });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
  }
}
