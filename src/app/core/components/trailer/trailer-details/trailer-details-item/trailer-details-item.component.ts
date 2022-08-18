import { TrailerResponse } from './../../../../../../../appcoretruckassist/model/trailerResponse';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TtRegistrationModalComponent } from '../../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '../../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { card_component_animation } from '../../../shared/animations/card-component.animations';
import { TtTitleModalComponent } from '../../../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';

@Component({
  selector: 'app-trailer-details-item',
  templateUrl: './trailer-details-item.component.html',
  styleUrls: ['./trailer-details-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class TrailerDetailsItemComponent implements OnInit {
  @Input() trailer: TrailerResponse | any = null;
  public note: FormControl = new FormControl();
  public trailerData: any;
  public svgColorVar: string;

  public trailerName: string;
  public dataTest: any;
  public toggler: boolean[] = [];
  constructor(
    private activated_route: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.note.patchValue(this.trailer[0].data.note);
    this.initTableOptions();
  }
  /**Function for toggle page in cards */
  public toggleResizePage(value: number, indexName: string) {
    this.toggler[value + indexName] = !this.toggler[value + indexName];
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
          title: 'Delete',
          name: 'delete-item',
          type: 'truck',
          text: 'Are you sure you want to delete truck(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }
  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  public optionsEvent(file: any, data: any, action: string) {
    switch (action) {
      case 'edit-registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: file.id,
            type: action,
            modal: 'trailer',
          }
        );
        break;
      }
      case 'edit-inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: file.id,
            type: action,
            modal: 'trailer',
          }
        );
        break;
      }
      case 'edit-title': {
        this.modalService.openModal(
          TtTitleModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: file.id,
            type: action,
            modal: 'trailer',
          }
        );
        break;
      }
      default: {
        break;
      }
    }
  }
}
