import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-truck-details-card',
  templateUrl: './truck-details-card.component.html',
  styleUrls: ['./truck-details-card.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class TruckDetailsCardComponent implements OnInit {
  public noteControl: FormControl = new FormControl();
  public buttonsArrayPerfomance: any;
  public buttonsArrayFuel: any;
  public buttonsArrayRevenue: any;
  public toggler:boolean=false;
  public dataEdit:any;
  @Input() templateCard:boolean=false;
  @Input() data:any;
  constructor(private modalService:ModalService) { }

  ngOnInit(): void {
    this.noteControl.patchValue(this.data.note);
    this.initTableOptions();
    this.buttonsArrayPerfomance = [
      {
        id: 5,
        label: '1M',
        value: '1Mchart',
        name: 'chart',
        checked: false,
      },
      {
        id: 10,
        label: '3M',
        value: '3Mchart',
        name: 'chart',
        checked: false,
      },
      {
        id: 12,
        label: '6M',
        value: '6Mchart',
        name: 'chart',
        checked: false,
      },
      {
        id: 15,
        label: '1Y',
        value: '1Ychart',
        name: 'chart',
        checked: false,
      },
      {
        id: 20,
        label: 'YTD',
        value: 'YTDchart',
        name: 'chart',
        checked: false,
      },
      {
        id: 30,
        label: 'ALL',
        value: 'ALLchart',
        name: 'chart',
        checked: true,
      },
    ];
    this.buttonsArrayRevenue = [
      {
        id: 36,
        label: '1M',
        value: '1Mrev',
        name: 'rev',
        checked: false,
      },
      {
        id: 66,
        label: '3M',
        value: '3Mrev',
        name: 'rev',
        checked: false,
      },
      {
        id: 97,
        label: '6M',
        value: '6Mrev',
        name: 'rev',
        checked: false,
      },
      {
        id: 99,
        label: '1Y',
        value: '1Yrev',
        name: 'rev',
        checked: true,
      },
      {
        id: 101,
        label: 'YTD',
        value: 'YTDrev',
        name: 'rev',
        checked: false,
      },
      {
        id: 103,
        label: 'ALL',
        value: 'ALLrev',
        name: 'rev',
        checked: false,
      },
    ];
    this.buttonsArrayFuel = [
      {
        id: 222,
        label: '1M',
        value: '1Mfuel',
        name: 'fuel',
        checked: false,
      },
      {
        id: 333,
        label: '3M',
        value: '3Mfuel',
        name: 'fuel',
        checked: false,
      },
      {
        id: 444,
        label: '6M',
        value: '6Mfuel',
        name: 'fuel',
        checked: false,
      },
      {
        id: 555,
        label: '1Y',
        value: '1Yfuel',
        name: 'fuel',
        checked: true,
      },
      {
        id: 231,
        label: 'YTD',
        value: 'YTDfuel',
        name: 'fuel',
        checked: false,
      },
      {
        id: 213,
        label: 'ALL',
        value: 'ALLfuel',
        name: 'fuel',
        checked: false,
      },
    ];
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

  /**Function for toggle page in cards */
  public toggleResizePage(value: boolean) {
    this.toggler = value;
    console.log(this.toggler);
  }

  public optionsEvent(any: any, action: string) {
    switch (action) {
      case 'edit-registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            id: this.data.id,
            file_id: any.id,
            type: action,
            modal: 'truck',
          }
        );
        break;
      }
      case 'edit-inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            id: this.data.id,
            file_id: any.id,
            type: action,
            modal: 'truck',
          }
        );
        break;
      }
      case 'edit-title': {
        break;
      }
      default: {
        break;
      }
    }
  }
   /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }
}
