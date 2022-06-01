import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';

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
  constructor() { }

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
   public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
    /**Function retrun id */
    public identity(index: number, item: any): number {
      return item.id;
    }
    /**Function return format phone from DB */
    public formatPhone(phoneNumberString: string) {
      const value = phoneNumberString;
      const number = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      phoneNumberString = number;
      return number;
    }
}
