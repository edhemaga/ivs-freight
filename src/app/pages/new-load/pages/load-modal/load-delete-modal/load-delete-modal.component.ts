import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// Interfaces
import { ILoadDeleteModal } from '@pages/new-load/interfaces';

// Components
import { CaDeleteModalComponent } from 'ca-components';

@Component({
    selector: 'app-load-delete-modal',
    templateUrl: './load-delete-modal.component.html',
    styleUrl: './load-delete-modal.component.scss',
    standalone: true,
    imports: [CommonModule, CaDeleteModalComponent],
})
export class LoadDeleteModalComponent {
    @Input() modalData: ILoadDeleteModal;
}
