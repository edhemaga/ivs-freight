import { TruckResponse } from './../../../../../../appcoretruckassist/model/truckResponse';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckQuery } from '../state/truck.query';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';

@Component({
  selector: 'app-truck-details-card',
  templateUrl: './truck-details-card.component.html',
  styleUrls: ['./truck-details-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TruckDetailsCardComponent implements OnInit {
  public noteControl: FormControl = new FormControl();
  public buttonsArrayPerfomance: any;
  public buttonsArrayFuel: any;
  public buttonsArrayRevenue: any;
  public toggler: boolean = false;
  public truckDropDowns: any[] = [];
  public dataEdit: any;
  @Input() templateCard: boolean = false;
  @Input() truck: TruckResponse | any;
  public truck_active_id: number = +this.activeted_route.snapshot.params['id'];
  public truck_list: any[] = this.trucksQuery.getAll();
  constructor(
    private activeted_route: ActivatedRoute,
    private modalService: ModalService,
    private trucksQuery: TruckQuery,
    private detailsPageDriverSer: DetailsPageService
  ) {}

  ngOnInit(): void {
    this.getTruckDropdown();

    this.noteControl.patchValue(this.truck.note);

    this.buttonSwitcher();
    this.initTableOptions();
  }
  public buttonSwitcher() {
    this.buttonsArrayPerfomance = [
      {
        id: 5,
        name: '1M',
      },
      {
        id: 10,
        name: '3M',
      },
      {
        id: 12,
        name: '6M',
      },
      {
        id: 15,
        name: '1Y',
      },
      {
        id: 20,
        name: 'YTD',
      },
      {
        id: 30,
        name: 'ALL',
      },
    ];
    this.buttonsArrayRevenue = [
      {
        id: 36,
        name: '1M',
      },
      {
        id: 66,
        name: '3M',
      },
      {
        id: 97,
        name: '6M',
      },
      {
        id: 99,
        name: '1Y',
      },
      {
        id: 101,
        name: 'YTD',
      },
      {
        id: 103,
        name: 'ALL',
      },
    ];
    this.buttonsArrayFuel = [
      {
        id: 222,
        name: '1M',
        checked: false,
      },
      {
        id: 333,
        name: '3M',
      },
      {
        id: 444,
        name: '6M',
      },
      {
        id: 555,
        name: '1Y',
      },
      {
        id: 231,
        name: 'YTD',
      },
      {
        id: 213,
        name: 'ALL',
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
  public changeTabPerfomance(ev: any) {
    console.log(ev.id);
  }
  public changeTabFuel(ev: any) {
    console.log(ev.id);
  }
  public changeTabRevenue(ev: any) {
    console.log(ev.id);
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
            id: this.truck.id,
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
            id: this.truck.id,
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
  public getTruckDropdown() {
    this.truckDropDowns = this.trucksQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.truckNumber,
        active: item.id === this.truck.id,
      };
    });
  }
  public onSelectedTruck(event: any) {
    if (event.id !== this.truck.id) {
      this.truckDropDowns = this.trucksQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.truckNumber,
          svg: item.truckType.logoName,
          active: item.id === event.id,
          folder: 'common/trucks/',
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }
  public onChangeTruck(action: string) {
    let currentIndex = this.truck_list
      .map((truck) => truck.id)
      .indexOf(this.truck.id);
    switch (action) {
      case 'previous': {
        currentIndex = --currentIndex;
        if (currentIndex != -1) {
          this.detailsPageDriverSer.getDataDetailId(
            this.truck_list[currentIndex].id
          );
          this.onSelectedTruck({ id: this.truck_list[currentIndex].id });
        }
        break;
      }
      case 'next': {
        currentIndex = ++currentIndex;
        if (currentIndex !== -1 && this.truck_list.length > currentIndex) {
          this.detailsPageDriverSer.getDataDetailId(
            this.truck_list[currentIndex].id
          );
          this.onSelectedTruck({ id: this.truck_list[currentIndex].id });
        }

        break;
      }
      default: {
        break;
      }
    }
  }
}
