import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';

// models
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';

@Component({
    selector: 'app-repair-shop-details-item-dropdown',
    templateUrl: './repair-shop-details-item-dropdown.component.html',
    styleUrls: ['./repair-shop-details-item-dropdown.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
    ],
})
export class RepairShopDetailsItemDropdownComponent {
    @Input() options: DropdownItem[];
    @Input() index: number;

    @Output() dropdownOptionEmitter: EventEmitter<string> =
        new EventEmitter<string>();

    @HostListener('document:click', ['$event.target'])
    onClickOutside(targetElement: HTMLElement): void {
        const isInsideClick =
            this.elementRef.nativeElement.contains(targetElement);

        if (!isInsideClick && this.index >= 0) {
            this.dropdownOptionEmitter.emit(RepairShopDetailsStringEnum.CLOSE);
        }
    }

    constructor(private elementRef: ElementRef) {}

    public trackByIdentity = (index: number): number => index;

    public handleDropdownOptionClick(option: string): void {
        this.dropdownOptionEmitter.emit(option);
    }
}
