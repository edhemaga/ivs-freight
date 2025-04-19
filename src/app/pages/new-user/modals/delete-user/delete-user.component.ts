import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// Interfaces
import { IUserDeleteModal } from '@pages/new-user/interfaces';

// Components
import { CaDeleteModalComponent } from 'ca-components';

@Component({
    selector: 'app-delete-user',
    standalone: true,
    templateUrl: './delete-user.component.html',
    styleUrl: './delete-user.component.scss',
    imports: [CommonModule, CaDeleteModalComponent],
})
export class DeleteUserComponent {
    @Input() modalData: IUserDeleteModal;
}
