import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-violation-details-page',
  templateUrl: './violation-details-page.component.html',
  styleUrls: ['./violation-details-page.component.scss'],
})
export class ViolationDetailsPageComponent implements OnInit {
  public violationInitCongif: any[] = [];
  constructor() {}

  ngOnInit(): void {
    this.violationConfig();
  }

  /**Default names for header */
  public violationConfig() {
    this.violationInitCongif = [
      {
        id: 0,
        name: 'Roadside Insp. Details',
        template: 'general',
        data: '',
      },
      {
        id: 1,
        name: 'Violation',
        template: 'violation',
        data: '',
        hide: true,
        customText: 'Time Weight',
        hasArrow: false,
        length: 14,
        counterViolation: 4,
      },
      {
        id: 2,
        name: 'Citation',
        template: 'citation',
        data: '',
        length: 12,
      },
    ];
  }

  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
}
