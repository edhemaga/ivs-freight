import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trailer-details',
  templateUrl: './trailer-details.component.html',
  styleUrls: ['./trailer-details.component.scss']
})
export class TrailerDetailsComponent implements OnInit {
  public trailerDetailsConfig: any[] = [];
  public data:any;
  registrationLength:number;
  inspectionLength:number;
  titleLength:number;
  constructor(
    private activated_route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.data=this.activated_route.snapshot.data;
    this.registrationLength=this.data.trailer.registrations.length;
    this.inspectionLength=this.data.trailer.inspections.length;
    this.titleLength=this.data.trailer.titles.length;
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
        data:this.registrationLength
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
        data:this.inspectionLength   
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
        data:this.titleLength
     
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
