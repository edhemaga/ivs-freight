import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// Interfaces
import { IUserDeleteModal } from '@pages/new-user/interfaces';

// Components
import { CaDeleteModalComponent, CaProfileImageComponent } from 'ca-components';

@Component({
    selector: 'app-deactivate-user',
    templateUrl: './deactivate-user.component.html',
    styleUrl: './deactivate-user.component.scss',
    standalone: true,
    imports: [CommonModule, CaDeleteModalComponent, CaProfileImageComponent],
})
export class DeactivateUserComponent {
    @Input() modalData: IUserDeleteModal;
}
