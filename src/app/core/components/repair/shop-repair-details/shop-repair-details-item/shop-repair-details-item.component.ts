import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RepairShopResponse } from 'appcoretruckassist';
import { ShopQuery } from '../../state/shop.query';

@Component({
  selector: 'app-shop-repair-details-item',
  templateUrl: './shop-repair-details-item.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./shop-repair-details-item.component.scss'],
})
export class ShopRepairDetailsItemComponent implements OnInit {
  @Input() shopData: RepairShopResponse | any = null;

  public dummyData: any;
  public dummyDataRepair: any[] = [];
  public dummyDataVehicle: any[] = [];
  public reviewsRepair: any = [
    {
      id: 1,
      companyUser: {
        id: 2,
        fullName: 'Vlade Divac',
        avatar:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Vlade_Divac_2016-mc.rs_%28cropped%29.jpg/1200px-Vlade_Divac_2016-mc.rs_%28cropped%29.jpg',
        reaction: 'dislike',
      },
      commentContent:
        'Amet, consetetur sadipscing elit dolor sit amet, consetetur sadipscing elit. Lorem ipsum dolor sit amet, consetetur sadipscing elit.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: false,
    },
    {
      id: 3,
      companyUser: {
        id: 4,
        fullName: 'Angela Martin',
        avatar:
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80',
        reaction: 'like',
      },
      commentContent: 'Lorem ipsum dolor sit amet, consetetur sadipscing elit.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: false,
    },
    {
      id: 5,
      companyUser: {
        id: 6,
        fullName: 'Milos Teodosic',
        avatar:
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80',
        reaction: 'like',
      },
      commentContent: 'Lorem ipsum dolor sit amet, consetetur sadipscing elit.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: false,
    },
  ];
  constructor(private shopQuery: ShopQuery) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.dummyDataRep();
    this.dummyDataVeh();
  }
  /**Function for dots in cards */
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

  public dummyDataVeh() {
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
  }
  public dummyDataRep() {
    this.dummyDataRepair = [
      {
        unit: 'R53201',
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
      {
        unit: 'R53202',
        date: '08/10/20',
        inv: '1001-18',
        desc: 'Engine oil and filter ● Transmissioningddsadasdasdasdasdasdasdasdad',
        cost: '785.53',
        finishOrder: true,
      },
      {
        unit: 'R53205',
        date: '08/10/20',
        inv: '1001-18',
        desc: 'Engine oil and filter ● Transmissioningddsadasdasdasdasdasdasdasdad',
        cost: '785.53',
        finishOrder: false,
      },
    ];
  }
  public changeReviewsEvent(reviews: { data: any[]; action: string }) {
    this.reviewsRepair = [...reviews.data];
    // TODO: API CREATE OR DELETE
  }
}
