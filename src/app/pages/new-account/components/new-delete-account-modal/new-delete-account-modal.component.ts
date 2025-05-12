import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// Components
import { CaDeleteModalComponent } from 'ca-components';

// Models
import { IMappedAccount } from '@pages/new-account/interfaces';

// Enums
import { eStringPlaceholder } from '@shared/enums/string-placeholder.enum';

@Component({
    selector: 'app-new-delete-account-modal',
    imports: [CommonModule, CaDeleteModalComponent],
    templateUrl: './new-delete-account-modal.component.html',
    styleUrl: './new-delete-account-modal.component.scss',
    standalone: true,
})
export class NewDeleteAccountModalComponent {
    @Input() modalData: IMappedAccount[];

    public eStringPlaceholder = eStringPlaceholder;
}
