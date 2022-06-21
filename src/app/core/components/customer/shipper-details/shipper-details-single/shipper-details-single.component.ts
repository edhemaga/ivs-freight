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
  constructor() { }

  ngOnInit(): void {
  }

}
