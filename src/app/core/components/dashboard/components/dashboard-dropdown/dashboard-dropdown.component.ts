import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';

// bootstrap
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// models
import { DropdownItem } from '../../state/models/dropdown-item.model';

@Component({
    selector: 'app-dashboard-dropdown',
    templateUrl: './dashboard-dropdown.component.html',
    styleUrls: ['./dashboard-dropdown.component.scss'],
})
export class DashboardDropdownComponent implements OnInit {
    @ViewChild('popover') public popover: NgbPopover;

    @Input() dropdownList: DropdownItem[];

    @Output() dropdownItemEmitter = new EventEmitter<DropdownItem>();

    constructor() {}

    ngOnInit(): void {}

    public trackByIdentity = (_: number, item: DropdownItem): string =>
        item.name;

    public handleSwitchDropdownItemClick(dropdownItem: DropdownItem): void {
        this.dropdownItemEmitter.emit(dropdownItem);

        this.popover.close();
    }
}
