import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// Interfaces
import { IMappedLoad } from '@pages/new-load/interfaces';

@Component({
    selector: 'app-load-delete-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './load-delete-modal.component.html',
    styleUrl: './load-delete-modal.component.scss',
})
export class LoadDeleteModalComponent {
    @Input() loads: IMappedLoad[];
    @Input() isTemplate: boolean;
    @Input() isPending: boolean;
}
