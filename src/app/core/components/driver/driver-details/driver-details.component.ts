import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// implements OnInit, OnDestroy
export class DriverDetailsComponent {
  constructor() {}
}
