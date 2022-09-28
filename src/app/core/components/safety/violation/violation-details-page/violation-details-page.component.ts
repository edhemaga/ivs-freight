import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RoadsideInspectionResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-violation-details-page',
  templateUrl: './violation-details-page.component.html',
  styleUrls: ['./violation-details-page.component.scss'],
})
export class ViolationDetailsPageComponent implements OnInit {
  public violationInitCongif: any[] = [];
  public violationData: any;
  constructor(private act_route: ActivatedRoute) {}

  ngOnInit(): void {
    this.violationConfig(this.act_route.snapshot.data.roadItem);
  }

  /**Default names for header */
  public violationConfig(data: RoadsideInspectionResponse) {
    this.violationInitCongif = [
      {
        id: 0,
        name: 'Roadside Insp. Details',
        template: 'general',
        data: data,
      },
      {
        id: 1,
        name: 'Violation',
        template: 'violation',
        data: data,
        hide: true,
        customText: 'Time Weight',
        hasArrow: false,
        length: 14,
        counterViolation: data?.timeWeight ? data.timeWeight : 0,
      },
      {
        id: 2,
        name: 'Citation',
        template: 'citation',
        data: data,
        length: 12,
      },
    ];
  }

  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
}
