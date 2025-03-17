import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

@Component({
  selector: 'app-load-details-stops',
  templateUrl: './load-details-stops.component.html',
  styleUrl: './load-details-stops.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class LoadDetailsStopsComponent {
  constructor(protected loadStoreService: LoadStoreService) {}
}
