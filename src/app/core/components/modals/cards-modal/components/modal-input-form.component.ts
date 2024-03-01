import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    Self,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CardRows } from '../../../shared/model/cardData';

@Component({
    selector: 'app-modal-input-form',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, NgbModule],
    templateUrl: './modal-input-form.component.html',
    styleUrls: ['./modal-input-form.component.scss'],
})
export class ModalInputFormComponent implements ControlValueAccessor {
    @ViewChild('inputTitleValue') public inputTitleValue: ElementRef;

    public _dataCardsModal: CardRows[];
    public filteredCardsModalData: CardRows[];

    @Input() emptyValue: string;
    @Input() set dataCardModal(value: CardRows[]) {
        this._dataCardsModal = value;
        this.filteredCardsModalData = value;

        this.cdr.detectChanges();
    }

    @Input() defaultValue: string;

    public tooltip: NgbTooltip;

    public lattersToHighlight: string;

    get getSuperControl() {
        return this.superControl.control;
    }

    public writeValue(_: any): void {}
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    public onChange(_: any): void {}
    public registerOnTouched(_: any): void {}

    constructor(
        
        private cdr: ChangeDetectorRef,
        @Self() public superControl: NgControl
    ) {
        this.superControl.valueAccessor = this;
    }

    public cardTitleSelected(selectedRow: CardRows, popover) {
        console.log(selectedRow);
        this.inputTitleValue.nativeElement.value = selectedRow.title;

        this.onChange({ ...selectedRow, selected: true });

        

        if (popover) {
            popover.close();
        }
    }
    public toggleCardsModalDropdown(
        tooltip: NgbTooltip,
        card: CardRows[]
    ): void {
        this.tooltip = tooltip;

        tooltip.open({ titles: card });
    }

    public filterArrayCardsModalDropdown(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            const searchTerm = event.target.value.toLowerCase();

            if (searchTerm.length >= 2) {
                const filteredInModalTitles = this.filterModal(searchTerm);

                this.lattersToHighlight = searchTerm;

                if (!filteredInModalTitles.length) {
                    this.filteredCardsModalData = this._dataCardsModal;
                } else {
                    this.filteredCardsModalData = [...filteredInModalTitles];
                }
                console.log(filteredInModalTitles);
            }
        }
    }

    private filterModal(searchString: string): CardRows[] {
        const filterTrucks = this.filteredCardsModalData.filter((title) =>
            title.title.toLowerCase().includes(searchString)
        );

        return filterTrucks;
    }
}
