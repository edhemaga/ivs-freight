import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// Components
import { CaDeleteModalComponent } from 'ca-components';

// Models
import { IMappedAccount } from '../../interfaces/mapped-account.interface';
import { eStringPlaceholder } from '../../../../shared/enums/string-placeholder.enum';

@Component({
    selector: 'app-new-delete-account-modal',
    standalone: true,
    imports: [CommonModule, CaDeleteModalComponent],
    templateUrl: './new-delete-account-modal.component.html',
    styleUrl: './new-delete-account-modal.component.scss',
})
export class NewDeleteAccountModalComponent {
    @Input() modalData: IMappedAccount[];

    public eStringPlaceholder = eStringPlaceholder;
}
