import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Third-party modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { TaCommentsSearchComponent } from '@shared/components/ta-comments-search/ta-comments-search.component';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eSharedString } from '@shared/enums';

// Components
import { CaLoadStatusLogComponent } from 'ca-components';

// Enums
import {
    eGeneralActions,
    eColor,
    eDateTimeFormat,
    eSortDirection,
    eIconPath,
} from '@shared/enums';

// Models
import { CommentData } from '@shared/models';
import {
    CommentService,
    CreateCommentCommand,
    SignInResponse,
} from 'appcoretruckassist';
import { ICreateCommentMetadata } from '@pages/load/pages/load-table/models';

// helpers
import moment from 'moment';
import { UserHelper } from '@shared/utils/helpers';

// pipes
import { CreateLoadCommentsPipe } from '@shared/pipes';
import { eStringPlaceholder } from 'ca-components';

@Component({
    selector: 'app-load-details-additional',
    templateUrl: './load-details-additional.component.html',
    styleUrl: './load-details-additional.component.scss',
    standalone: true,
    imports: [
        // Modules

        // modules
        CommonModule,

        // Components
        CaLoadStatusLogComponent,
        ,
        AngularSvgIconModule,
        NgbModule,
        // components
        TaCommentsSearchComponent,
        // pipes
        CreateLoadCommentsPipe,
    ],
})
export class LoadDetailsAdditionalComponent {
    public eSharedString = eSharedString;

    public statusLogSortDirection = eSharedString.DSC;

    constructor(protected loadStoreService: LoadStoreService) {}

    public onSortChange(sortDirection: eSharedString): void {
        this.statusLogSortDirection = sortDirection;
    }
}
