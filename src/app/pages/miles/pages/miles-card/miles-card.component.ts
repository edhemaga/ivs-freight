import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';
import { TableCardViewComponent } from '@shared/components/ta-modal-table/components/table-card-view/table-card-view.component';

@Component({
  selector: 'app-miles-card',
  templateUrl: './miles-card.component.html',
  styleUrl: './miles-card.component.scss',
  standalone: true,
  imports: [CommonModule, TableCardViewComponent],
})
export class MilesCardComponent {
constructor(public milesStoreService: MilesStoreService) {}
}
