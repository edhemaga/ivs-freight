import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-truckassist-table-body',
  templateUrl: './truckassist-table-body.component.html',
  styleUrls: ['./truckassist-table-body.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TruckassistTableBodyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
