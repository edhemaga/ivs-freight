import { TrailerTService } from './../../state/trailer.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';

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
  constructor(
    private activated_route: ActivatedRoute,
    private trailerTService: TrailerTService
  ) {}

  ngOnInit(): void {
    this.getTrailerById();
    this.initTableOptions();
  }
  public getTrailerById() {
    this.trailerData = this.activated_route.snapshot.data;
    this.note.patchValue(this.trailerData.trailer.note);
    this.trailerName = this.trailerData.trailer.trailerNumber;
    this.svgColorVar = this.trailerData.trailer.color.code;
  }
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
  public formatPhone(phoneNumberString: string) {
    const value = phoneNumberString;
    const number = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    phoneNumberString = number;
    return number;
  }
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
}
