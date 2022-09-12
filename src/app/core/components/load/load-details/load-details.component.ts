import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadResponse } from '../../../../../../appcoretruckassist/model/loadResponse';

@Component({
  selector: 'app-load-details',
  templateUrl: './load-details.component.html',
  styleUrls: ['./load-details.component.scss'],
})
export class LoadDetailsComponent implements OnInit, OnChanges {
  public loadConfig: any;
  constructor(private activated_route: ActivatedRoute) {}
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
  ngOnInit(): void {
    this.detailCongif(this.activated_route.snapshot.data.loadItem);
  }
  /**Function template and names for header and other options in header */
  public detailCongif(data: LoadResponse) {
    this.loadConfig = [
      {
        id: 0,
        name: 'Active Load Details',
        template: 'general',
        data: data,
      },
      {
        id: 1,
        name: 'Finance',
        template: 'finance',
        req: false,
        hide: true,
        data: data,
      },
      {
        id: 2,
        name: 'Stop',
        template: 'stop',
        req: false,
        hide: true,
        data: data,
        length: data?.stops?.length ? data.stops.length : 0,
      },
      {
        id: 3,
        name: 'Comment',
        template: 'comment',
        hide: false,
        hasArrow: true,
        data: data,
        length: data?.comments?.length ? data.comments.length : 0,
      },
    ];
  }
  /**Function retrun id */
  public identity(index: number, item: any): number {
    return index;
  }
}
