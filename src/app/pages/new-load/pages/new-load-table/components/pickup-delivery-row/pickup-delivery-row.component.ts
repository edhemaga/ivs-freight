import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LoadStopInfo } from 'appcoretruckassist';

@Component({
  selector: 'app-pickup-delivery-row',
  standalone: true,
  templateUrl: './pickup-delivery-row.component.html',
  styleUrl: './pickup-delivery-row.component.scss',
  imports: [
      CommonModule,
  ],
})
export class PickupDeliveryRowComponent {
  @Input() data: LoadStopInfo;
}
