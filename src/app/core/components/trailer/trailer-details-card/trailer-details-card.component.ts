import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TrailerResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { card_component_animation } from '../../shared/animations/card-component.animations';
import { TrailersMinimalListQuery } from '../state/trailer-minimal-list-state/trailer-minimal.query';
import { TrailerTService } from '../state/trailer.service';

@Component({
  selector: 'app-trailer-details-card',
  templateUrl: './trailer-details-card.component.html',
  styleUrls: ['./trailer-details-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class TrailerDetailsCardComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() trailer: TrailerResponse | any;
  @Input() templateCard: boolean = false;
  public note: FormControl = new FormControl();
  public toggler: boolean = false;
  public dataEdit: any;
  public toggleOwner: boolean = true;
  public trailerDropDowns: any[] = [];
  private destroy$ = new Subject<void>();
  public trailer_list: any[] = this.trailerMinimalQuery.getAll();
  constructor(
    private detailsPageDriverSer: DetailsPageService,
    private trailerMinimalQuery: TrailersMinimalListQuery,
    private trailerService: TrailerTService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.trailer?.firstChange) {
      this.getTrailerDropdown();
      this.note.patchValue(changes.trailer.currentValue.note);
    }
    this.trailerMinimalQuery
      .selectAll()
      .subscribe((item) => (this.trailer_list = item));
  }
  ngOnInit(): void {
    this.getTrailerById(this.trailer.id);
    this.initTableOptions();
    this.getTrailerDropdown();
  }

  public getTrailerById(id: number) {
    this.trailerService
      .getTrailerById(id, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => item);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
