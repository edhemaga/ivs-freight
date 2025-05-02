import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { CaModalComponent } from 'ca-components';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrl: './user-modal.component.scss',
    standalone: true,
    imports: [CommonModule, CaModalComponent],
})
export class UserModalComponent {}
