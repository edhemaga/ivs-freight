import { Component, Input, ViewEncapsulation } from '@angular/core';

//Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';

//Pipes
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';

//Models
import { DepartmentContacts } from '@shared/models/department-contacts.model';

//Constants
import { ContactsCardSvgRoutes } from './utils/svg-routes/contacts-card-svg-routes';

@Component({
    selector: 'app-ta-contacts-card',
    templateUrl: './ta-contacts-card.component.html',
    styleUrls: ['./ta-contacts-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        //Moduless
        CommonModule,
        AngularSvgIconModule,

        //Components
        TaCustomCardComponent,
        TaCopyComponent,

        //Pipes
        FormatPhonePipe,
    ],
})
export class TaContactsCardComponent {
    @Input() departmentContacts: DepartmentContacts[];

    public contactsImageRoutes = ContactsCardSvgRoutes;

    constructor() {}

    public identity(index: number, item: DepartmentContacts): number {
        return item.id;
    }
}
