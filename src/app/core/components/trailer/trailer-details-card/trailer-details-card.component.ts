import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-trailer-details-card',
  templateUrl: './trailer-details-card.component.html',
  styleUrls: ['./trailer-details-card.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class TrailerDetailsCardComponent implements OnInit {
  @Input() data:any;
  @Input() templateCard:boolean=false;
  public note: FormControl = new FormControl();
  public toggler:boolean=false;
  public dataEdit:any;
  constructor(private modalService:ModalService) { }

  ngOnInit(): void {
    this.note.patchValue(this.data.note);
    this.initTableOptions();
  }
    /**Function for toggle page in cards */
  public toggleResizePage(value: boolean) {
    this.toggler = value;
    console.log(this.toggler);
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

   /**Function return format date from DB */
    /**Function retrun id */
    public identity(index: number, item: any): number {
      return item.id;
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
              id: this.data.id,
              file_id: any.id,
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
