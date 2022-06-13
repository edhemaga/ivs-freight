import { card_component_animation } from './../../shared/animations/card-component.animations';
import {
  AfterContentInit,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { createBase64 } from 'src/app/core/utils/base64.image';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverCdlModalComponent } from '../driver-details/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../driver-details/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../driver-details/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../driver-details/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import moment from 'moment';
import { SumArraysPipe } from 'src/app/core/pipes/sum-arrays.pipe';

@Component({
  selector: 'app-driver-details-card',
  templateUrl: './driver-details-card.component.html',
  styleUrls: ['./driver-details-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
  providers: [SumArraysPipe],
})
export class DriverDetailsCardComponent implements OnInit {
  @Input() data: any;
  @Input() templateCard: boolean = false;
  public note: FormControl = new FormControl();
  public copiedPhone: boolean = false;
  public copiedBankRouting: boolean = false;
  public copiedBankAccount: boolean = false;
  public copiedEin: boolean = false;
  public copiedSSN: boolean = false;
  public copiedDriverPhone: boolean = false;
  public copiedDriverEmail: boolean = false;
  public isAccountVisible: boolean = true;
  public accountText: string = null;
  public buttonsArray: any;
  public duttyLocationCounter: number = 0;
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
  constructor(
    private sanitazer: DomSanitizer,
    private modalService: ModalService,
    private sumArr: SumArraysPipe
  ) {}

 

  ngOnInit(): void {
    console.log(this.data);
    this.initTableOptions();
    this.tabsDriver = [
      {
        id: 223,
        name: '1M',
      },
      {
        id: 513,
        name: '3M',
      },
      {
        id: 412,
        name: '6M',
      },
      {
        id: 515,
        name: '1Y',
      },
      {
        id: 1210,
        name: 'YTD',
      },
      {
        id: 1011,
        name: 'ALL',
      },
    ];
    this.getYearsAndDays();
    this.widthOfProgress();
  }
  /**Function return user image if have in DB or default image */
  public transformImage() {
    let img;
    if (this.data.avatar) {
      img = createBase64(this.data.avatar);
    } else {
      img = 'assets/svg/common/ic_no_avatar_driver.svg';
    }
    return this.sanitazer.bypassSecurityTrustResourceUrl(img);
  }
  /**Function for toggle page in cards */
  public toggleResizePage(value: number) {
    this.toggler[value] = !this.toggler[value];
  }
  public changeTab(ev: any) {
    console.log(ev.id);
    this.selectedTab = ev.id;
  }

  public optionsEvent(any: any, action: string) {
    console.log(any);
    console.log(this.data);
    switch (action) {
      case 'edit-licence': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.data.id,
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
            id: this.data.id,
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
            id: this.data.id,
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
            id: this.data.id,
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

  /* To copy any Text */
  public copyText(val: any, copVal: string) {
    switch (copVal) {
      case 'phone':
        this.copiedPhone = true;
       const timeoutPhone = setInterval(() => {
          this.copiedPhone = false;
          clearInterval(timeoutPhone);
        }, 300);
        break;
      case 'bankAcc':
        this.copiedBankAccount = true;
        const timeoutBank = setInterval(() => {
          this.copiedBankAccount = false;
          
         clearInterval(timeoutBank);
        }, 300);
        break;
      case 'bankRouting':
        this.copiedBankRouting = true;
        const timeoutRouting =  setInterval(() => {
          this.copiedBankRouting = false;
          clearInterval(timeoutRouting);
        }, 300);
        break;
      case 'ein':
        this.copiedEin = true;
        const timeoutEin =  setInterval(() => {
          this.copiedEin = false;
          clearInterval(timeoutEin);
        }, 300);
        break;
      case 'ssn':
        this.copiedSSN = true;
        const timeoutSSN = setInterval(() => {
          this.copiedSSN = false;
          clearInterval(timeoutSSN);
        }, 300);
        break;
      case 'driver-phone':
        this.copiedDriverPhone = true;
        const timeoutDriverPhone =  setInterval(() => {
          this.copiedDriverPhone = false;
          clearInterval(timeoutDriverPhone);
        }, 300);
        break;
      case 'driver-email':
        this.copiedDriverEmail = true;
        const timeoutDriverEmail = setInterval(() => {
          this.copiedDriverEmail = false;
          clearInterval(timeoutDriverEmail);
        }, 300);
        break;
    }

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    // selBox.focus();
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

  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
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

  public widthOfProgress() {
    let arrMinDate = [];
    let arrMaxDate = [];
    let dateDeactivate = [];
    if (this.data.employmentHistories) {
      const sum = this.sumArr.transform(
        this.data.employmentHistories.map((item) => {
          return {
            id: item.id,
            value: item.duration.Years * 365.25 + item.duration.Days,
          };
        })
      );
      console.log(sum);

      this.data.employmentHistories = this.data.employmentHistories.map(
        (element) => {
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
        }
      );
      let dateRes = new Date(Math.min.apply(null, arrMinDate)).toISOString();
      if (dateDeactivate.includes(true)) {
        this.deactivatePeriod = true;
      } else {
        this.deactivatePeriod = false;
      }
      this.firstDate = moment(dateRes).format('MM/DD/YY');
      if (arrMaxDate.includes('Invalid Date')) {
        this.lastDate = 'Today';
      } else {
        let maxEmpDate = new Date(Math.max.apply(null, arrMaxDate)).toISOString();
        this.lastDate = moment(maxEmpDate).format('MM/DD/YY');
      }
    }
    console.log('aa');
    
  }

  public getYearsAndDays() {
    let sum = 0;
    let sum2 = 0;
    if (this.data.employmentHistories) {
      this.data.employmentHistories.forEach((element) => {
        sum += element.duration.Years;
        sum2 += element.duration.Days;
      });
      let sum3 = sum * 365.25 + sum2;
      this.yearsService = Math.trunc(sum3 / 365.25);
      this.daysService = Math.trunc(sum3 % 365.25);
      console.log('bbb');
      
    }
    console.log('aaaa');
    
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
}
