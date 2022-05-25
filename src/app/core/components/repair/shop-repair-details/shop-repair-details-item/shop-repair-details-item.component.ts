import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop-repair-details-item',
  templateUrl: './shop-repair-details-item.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./shop-repair-details-item.component.scss'],
})
export class ShopRepairDetailsItemComponent implements OnInit {
  @Input() data: any = null;
  public noteControl: FormControl = new FormControl();
  public shopData: any;
  public dummyData: any;
  public dummyDataRepair: any[] = [];
  public dummyDataVehicle: any[] = [];
  public reviewsRepair: any[] = [];
  constructor(private _act_route: ActivatedRoute) {}

  ngOnInit(): void {
    this.shopData = this._act_route.snapshot.data;
    this.noteControl.patchValue('Neki notee');
    this.initTableOptions();
    this.dummyDataRep();
    this.dummyDataVeh()
  }

  public formatPhone(phoneNumberString: string) {
    const value = phoneNumberString;
    const number = value?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    phoneNumberString = number;
    return number;
  }

  public initTableOptions(): void {
    this.dummyData = {
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
  
  public dummyDataVeh(){
    this.dummyDataVehicle = [
      {
        unit: 'R53202',
        icon: 'assets/svg/truckassist-table/trailer/container.svg',
        key: '24',
        cost: '132,567,25',
      },
      {
        unit: 'R53202',
        icon: 'assets/svg/truckassist-table/trailer/gray-icons/car-hauler.svg',
        key: '54',
        cost: '132,567,25',
      },
      {
        unit: 'R53202',
        icon: 'assets/svg/truckassist-table/trailer/dumper.svg',
        key: '234',
        cost: '132,567,25',
      },
      {
        unit: 'R53202',
        icon: 'assets/svg/truckassist-table/trailer/gray-icons/reefer.svg',
        key: '42',
        cost: '132,567,25',
      },
    ];
    console.log(this.dummyDataVehicle);
    
  }
  public dummyDataRep() {
   
     this.dummyDataRepair = [
      {
        unit: 'R53202',
        date: '08/10/20',
        inv: '1001-18',
        desc: 'Engine oil and filter ● Transmissioningddsadasdasdasdasdasdasdasdad',
        cost: '785.53',
        finishOrder: true,
      },
      {
        unit: 'R53202',
        date: '08/10/20',
        inv: '1001-18',
        desc: 'Engine oil and filter ● Transmissioningddsadasdasdasdasdasdasdasdad',
        cost: '785.53',
        finishOrder: false,
      },
    ];
   
    console.log(this.dummyDataRepair);
  }
  public changeReviewsEvent(reviews: { data: any[]; action: string }) {
    this.reviewsRepair = [...reviews.data];
    // TODO: API CREATE OR DELETE
  }
}
