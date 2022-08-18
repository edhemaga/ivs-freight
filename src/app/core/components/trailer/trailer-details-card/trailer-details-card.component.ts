import { TrailersMinimalListQuery } from './../state/trailer-minimal-list-state/trailer-minimal.query';
import { TrailerResponse } from './../../../../../../appcoretruckassist/model/trailerResponse';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { card_component_animation } from '../../shared/animations/card-component.animations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { TrailerDetailsQuery } from '../state/trailer-details-state/trailer-details.query';
import { TtTitleModalComponent } from '../../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';
@Component({
  selector: 'app-trailer-details-card',
  templateUrl: './trailer-details-card.component.html',
  styleUrls: ['./trailer-details-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class TrailerDetailsCardComponent implements OnInit, OnChanges {
  @Input() trailer: TrailerResponse | any;
  @Input() templateCard: boolean = false;
  public note: FormControl = new FormControl();
  public toggler: boolean = false;
  public dataEdit: any;
  public toggleOwner: boolean = true;
  public trailerDropDowns: any[] = [];

  public trailer_list: any[] = this.trailerMinimalQuery.getAll();
  constructor(
    private modalService: ModalService,
    private detailsPageDriverSer: DetailsPageService,
    private trailerQuery: TrailerDetailsQuery,
    private activeted_route: ActivatedRoute,
    private trailerMinimalQuery: TrailersMinimalListQuery
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.trailer?.firstChange && changes?.trailer) {
      this.getTrailerDropdown();
      this.note.patchValue(changes.trailer.currentValue.note);
    }
  }
  ngOnInit(): void {
    this.initTableOptions();
    this.getTrailerDropdown();
  }
  /**Function for toggle page in cards */
  public toggleResizePage(value: boolean) {
    this.toggler = value;
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

  public getTrailerDropdown() {
    this.trailerDropDowns = this.trailerMinimalQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.trailerNumber,
        active: item.id === this.trailer.id,
      };
    });
  }
  public onSelectedTrailer(event: any) {
    if (event.id !== this.trailer.id) {
      this.trailerDropDowns = this.trailerMinimalQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.trailerNumber,
          active: item.id === event.id,
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }
  public onChangeTrailer(action: string) {
    let currentIndex = this.trailer_list.findIndex(
      (trailer) => trailer.id === this.trailer.id
    );
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
