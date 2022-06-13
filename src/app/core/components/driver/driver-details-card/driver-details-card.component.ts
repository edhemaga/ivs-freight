import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { createBase64 } from 'src/app/core/utils/base64.image';
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverCdlModalComponent } from '../driver-details/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../driver-details/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../driver-details/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../driver-details/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriversQuery } from '../state/driver.query';

@Component({
  selector: 'app-driver-details-card',
  templateUrl: './driver-details-card.component.html',
  styleUrls: ['./driver-details-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_modal_animation('showHideCardBody')],
})
export class DriverDetailsCardComponent implements OnInit, OnDestroy {
  @Input() data: any;
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
  @Input() templateCard: boolean = false;
  public toggler: boolean[] = [];
  public dataEdit: any;
  public selectedTab: number;
  public tabsDriver: any[] = [];
  public cdlNote1: FormControl = new FormControl();
  public mvrNote: FormControl = new FormControl();

  public driver_active_id: number = +this.activated_route.snapshot.params['id'];

  constructor(
    private sanitazer: DomSanitizer,
    private modalService: ModalService,
    private driversQuery: DriversQuery,
    private activated_route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getDriversDropdown();

    this.tabsDriver = [
      {
        id: 53333,
        name: '1M',
        checked: true,
      },
      {
        id: 53,
        name: '3M',
        checked: false,
      },
      {
        id: 42,
        name: '6M',
        checked: false,
      },
      {
        id: 36,
        name: '1Y',
        checked: false,
      },
      {
        id: 8932,
        name: 'YTD',
        checked: false,
      },
      {
        id: 1111,
        name: 'ALL',
        checked: false,
      },
    ];
    this.buttonsArray = [
      {
        id: 444,
        label: '1M',
        value: '1M',
        name: 'chart',
        checked: false,
      },
      {
        id: 555,
        label: '3M',
        value: '3M',
        name: 'chart',
        checked: false,
      },
      {
        id: 6666,
        label: '6M',
        value: '6M',
        name: 'chart',
        checked: false,
      },
      {
        id: 7777,
        label: '1Y',
        value: '1Y',
        name: 'chart',
        checked: false,
      },
      {
        id: 7774,
        label: 'YTD',
        value: 'YTD',
        name: 'chart',
        checked: false,
      },
      {
        id: 8888,
        label: 'ALL',
        value: 'ALL',
        name: 'chart',
        checked: true,
      },
    ];
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
        setTimeout(() => {
          this.copiedPhone = false;
        }, 2100);
        break;

      case 'bankAcc':
        this.copiedBankAccount = true;
        setTimeout(() => {
          this.copiedBankAccount = false;
        }, 2100);
        break;

      case 'bankRouting':
        this.copiedBankRouting = true;
        setTimeout(() => {
          this.copiedBankRouting = false;
        }, 2100);
        break;

      case 'ein':
        this.copiedEin = true;
        setTimeout(() => {
          this.copiedEin = false;
        }, 2100);
        break;

      case 'ssn':
        this.copiedSSN = true;
        setTimeout(() => {
          this.copiedSSN = false;
        }, 2100);
        break;

      case 'driver-phone':
        this.copiedDriverPhone = true;
        setTimeout(() => {
          this.copiedDriverPhone = false;
        }, 2100);
        break;
      case 'driver-email':
        this.copiedDriverEmail = true;
        setTimeout(() => {
          this.copiedDriverEmail = false;
        }, 2100);
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

  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }

  /**Function for dots in cards */
  public initTableOptions(): void {
    this.dataEdit = {
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

  driversDropdowns: any[] = [];

  public getDriversDropdown() {
    console.log(this.driver_active_id);
    this.driversDropdowns = this.driversQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.fullName,
        status: item.status,
        svg: item.owner ? 'driver-owner' : null,
        folder: 'common',
        active: item.id === this.driver_active_id,
      };
    });
  }

  public onSelectedDriver(event: any) {
    if (event) {
      this.driversDropdowns = this.driversQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.fullName,
          status: item.status,
          svg: item.owner ? 'driver-owner' : null,
          folder: 'common',
          active: item.id === event.id,
        };
      });
    }
  }

  ngOnDestroy(): void {}
}
