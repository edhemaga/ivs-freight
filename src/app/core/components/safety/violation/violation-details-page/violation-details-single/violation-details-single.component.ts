import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { card_component_animation } from '../../../../shared/animations/card-component.animations';

@Component({
  selector: 'app-violation-details-single',
  templateUrl: './violation-details-single.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./violation-details-single.component.scss'],
  animations: [card_component_animation('showHideCardBody')],
})
export class ViolationDetailsSingleComponent implements OnInit {
  @Input() violationData: any;
  public toggler: boolean[] = [];
  constructor() {}

  ngOnInit(): void {}
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  /**Function for toggle page in cards */
  public toggleResizePage(value: number, indexName: string) {
    this.toggler[value + indexName] = !this.toggler[value + indexName];
  }
}
