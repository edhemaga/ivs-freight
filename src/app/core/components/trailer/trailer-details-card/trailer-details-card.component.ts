import { TrailerResponse } from './../../../../../../appcoretruckassist/model/trailerResponse';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { card_component_animation } from '../../shared/animations/card-component.animations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerQuery } from '../state/trailer.query';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trailer-details-card',
  templateUrl: './trailer-details-card.component.html',
  styleUrls: ['./trailer-details-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class TrailerDetailsCardComponent implements OnInit {
  @Input() trailer: TrailerResponse | any;
  @Input() templateCard: boolean = false;
  public note: FormControl = new FormControl();
  public toggler: boolean = false;
  public dataEdit: any;
  public toggleOwner: boolean = true;
  public trailerDropDowns: any[] = [];
  public trailer_active_id: number =
    +this.activeted_route.snapshot.params['id'];
  public trailer_list: any[] = this.trailerQuery.getAll();
  constructor(
    private modalService: ModalService,
    private detailsPageDriverSer: DetailsPageService,
    private trailerQuery: TrailerQuery,
    private activeted_route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.note.patchValue(this.trailer.note);
    this.initTableOptions();
    this.getTrailerDropdown();
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
            id: this.trailer.id,
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
            id: this.trailer.id,
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

  public getTrailerDropdown() {
    this.trailerDropDowns = this.trailerQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.trailerNumber,
        active: item.id === this.trailer.id,
      };
    });
  }
  public onSelectedTrailer(event: any) {
    if (event.id !== this.trailer.id) {
      this.trailerDropDowns = this.trailerQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.trailerNumber,
          svg: item.trailerType.logoName,
          active: item.id === event.id,
          folder: 'common/trucks/',
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }
  public onChangeTrailer(action: string) {
    let currentIndex = this.trailer_list
      .map((trailer) => trailer.id)
      .indexOf(this.trailer.id);
    switch (action) {
      case 'previous': {
        currentIndex = --currentIndex;
        if (currentIndex != -1) {
          this.detailsPageDriverSer.getDataDetailId(
            this.trailer_list[currentIndex].id
          );
          this.onSelectedTrailer({ id: this.trailer_list[currentIndex].id });
        }
        break;
      }
      case 'next': {
        currentIndex = ++currentIndex;
        if (currentIndex !== -1 && this.trailer_list.length > currentIndex) {
          this.detailsPageDriverSer.getDataDetailId(
            this.trailer_list[currentIndex].id
          );
          this.onSelectedTrailer({ id: this.trailer_list[currentIndex].id });
        }

        break;
      }
      default: {
        break;
      }
    }
  }
}
