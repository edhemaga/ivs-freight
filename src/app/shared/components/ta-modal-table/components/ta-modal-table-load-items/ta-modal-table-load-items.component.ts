import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Enums
import { TaModalTableStringEnum } from '../../enums/ta-modal-table-string.enum';

//pipes
import { TrackByPropertyPipe } from '@shared/pipes/track-by-property.pipe';

// Models
import { LoadStopItemDropdownLists } from '@pages/load/pages/load-modal/models/load-stop-item-dropdowns-list.model';

// Components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';

@Component({
    selector: 'app-ta-modal-table-load-items',
    templateUrl: './ta-modal-table-load-items.component.html',
    styleUrls: ['./ta-modal-table-load-items.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        
        TaInputComponent,
        TaInputDropdownComponent,
        
        //pipes
        TrackByPropertyPipe,
    ],
})
export class TaModalTableLoadItemsComponent implements OnInit {
    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() stopItemDropdownLists: LoadStopItemDropdownLists;

    constructor() {}

    ngOnInit(): void {}

    get formArray() {
        console.log(this.modalTableForm?.get(this.arrayName))
      return this.modalTableForm?.get(this.arrayName) as UntypedFormArray;
  }

}
