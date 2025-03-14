import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

@Component({
  selector: 'app-load-details-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './load-details-general.component.html',
  styleUrl: './load-details-general.component.scss'
})
export class LoadDetailsGeneralComponent {
  constructor(protected loadStoreService: LoadStoreService) {}
}
