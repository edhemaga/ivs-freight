import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TtRegistrationModalComponent } from '../../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '../../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { ModalService } from '../../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-trailer-details-item',
  templateUrl: './trailer-details-item.component.html',
  styleUrls: ['./trailer-details-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TrailerDetailsItemComponent implements OnInit {
  @Input() data: any = null;
  public note: FormControl = new FormControl();
  public trailerData: any;
  public svgColorVar: string;
  public toggleOwner: boolean = false;
  public trailerName: string;
  public dataTest:any;
  public toggler:boolean=false;
  constructor(
    private activated_route: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.getTrailerById();
    this.initTableOptions();
  }
  /**Function return trailer by id */
  public getTrailerById() {
    this.trailerData = this.activated_route.snapshot.data;
    this.note.patchValue(this.trailerData.trailer.note)

  }
   /**Function return format date from DB */
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
   
  /**Function for toggle page in cards */
  public toggleResizePage(value: boolean) {
    this.toggler = value;
    console.log(this.toggler);
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

  public optionsEvent(any: any, action: string) {
    switch (action) {
      case 'edit-registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            id: any.id,
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
            id: any.id,
            type: action,
            modal: 'trailer',
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
}
