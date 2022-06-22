import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ShipperResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-shipper-details-single',
  templateUrl: './shipper-details-single.component.html',
  styleUrls: ['./shipper-details-single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ShipperDetailsSingleComponent implements OnInit {
  @Input() shipper: ShipperResponse | any = null;
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
    {
      id: 41,
      companyUser: {
        id: 5,
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
      id: 4,
      companyUser: {
        id: 21,
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
      id: 21,
      companyUser: {
        id: 42,
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
  constructor() { }

  ngOnInit(): void {
  }
  public changeReviewsEvent(reviews: { data: any[]; action: string }) {
    this.reviewsRepair = [...reviews.data];
    // TODO: API CREATE OR DELETE
  }

}
