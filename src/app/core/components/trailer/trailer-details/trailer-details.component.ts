import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trailer-details',
  templateUrl: './trailer-details.component.html',
  styleUrls: ['./trailer-details.component.scss']
})
export class TrailerDetailsComponent implements OnInit {
  public trailerDetailsConfig: any[] = [];
  constructor() { }

  ngOnInit(): void {
    this.trailerDetailsConfig = [
      {
        id: 0,
        name: 'Trailer Details',
        template: 'general',
      },
      {
        id: 1,
        name: 'Registration',
        template: 'registration',
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
   
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
     
      },
      {
        id: 4,
        name: 'Lease / Purchase',
        template: 'lease-purchase',
       
      },
    ];
  }
  public identity(index: number, item: any): number {
    return item.id;
  }
}
