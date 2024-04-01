import { SettingsCompanyService } from '../../services/settings-company.service';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// services
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';

// pipes
import { DetailsActiveItemPipe } from 'src/app/core/pipes/detailsActiveItem.pipe';

// enums
import {
    SETINGS_ENUMS,
    SETTINGS_ARROW_ACTIONS,
} from '../../../../enums/settings.enum';

//Components
import { ConfirmationModalComponent } from 'src/app/core/components/modals/confirmation-modal/confirmation-modal.component';

//Models
import { CompanyProperties } from '../../../../models/settings.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-settings-general',
    templateUrl: './settings-general.component.html',
    styleUrls: ['./settings-general.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DetailsPageService, DetailsActiveItemPipe],
})
export class SettingsGeneralComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('logoText') logoText: ElementRef;
    @ViewChild('logoBox') logoBox: ElementRef;

    @Input() public set optionsCompany(value: CompanyProperties[]) {
        this._optionsCompany = value;
        this.setIndexCompany();
    }
    @Input() public companyData: any; //leave any for now

    @Output() selectValue = new EventEmitter<string>();
    @Output() selectDropDown = new EventEmitter<boolean>();

    public _optionsCompany: CompanyProperties[];
    public isAccountVisible: boolean = false;
    public inputFormControl: UntypedFormControl = new UntypedFormControl();
    public optionsDivisonId: number;

    public toggleSelect: boolean;
    public timeZoneName: string;
    public companyDivision: boolean = false;
    public hasArrow: boolean;
    public changeFont: boolean;
    public selectedDropdown: boolean = false;
    public currentCompanyIndex: number;

    public fontSizeLogo: string;

    private destroy$ = new Subject<void>();

    constructor(
        private settingsCompanyService: SettingsCompanyService,
        public imageBase64Service: ImageBase64Service,
        private modalService: ModalService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.companyData?.currentValue?.divisions?.length < 1) {
            this.companyDivision = true;
            this.hasArrow = true;
        } else {
            this.companyDivision = false;
        }

        if (changes?.companyData?.currentValue?.divisions?.length > 1) {
            this.hasArrow = true;
        }

        if (
            changes?.companyData?.currentValue !==
            changes?.companyData?.previousValue
        ) {
            this.companyData = changes?.companyData?.currentValue;
        }

        if (this.companyData?.name?.length > 13) {
            this.changeFont = true;
        } else {
            this.changeFont = false;
        }

        if (!changes?.companyData?.currentValue?.logo) {
            setTimeout(() => {
                this?.changeFontSizeLogo();
            }, 0);
        }
    }

    ngOnInit(): void {
        let divisionArray = [];

        this._optionsCompany?.map((item) => {
            if (item.isDivision == true) {
                this.companyDivision = true;
            } else {
                this.companyDivision = false;
            }

            divisionArray.push(item.isDivision);
            if (divisionArray.includes(true)) {
                this.hasArrow = true;
            } else {
                this.hasArrow = false;
            }
        });

        if (this.companyData?.timeZone?.name) {
            this.timeZoneName = this.companyData?.timeZone?.name.substring(
                0,
                7
            );
        }

        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === SETINGS_ENUMS.COMPANY)
                                this.deleteDivisionCompanyById(res.id);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
    }

    public timeZoneFormat(mod: string): string {
        return mod.substring(0, 7);
    }

    public onAction(modal: {
        modalName: string;
        type: string;
        company?: CompanyProperties;
    }): void {
        this.settingsCompanyService.onModalAction(modal);
    }

    public identity(index: number, item: any): number {
        //leave any for now
        return item.id;
    }

    public onPickItem(value): void {
        if (this.hasArrow) {
            this.toggleSelect = true;
            this.selectDropDown.emit(value);
        }
    }
    public onSelectItem(event: any): void {
        //leave any for now
        if (event) {
            const currentIndex = this._optionsCompany?.findIndex(
                (comp) => comp.id === event.id
            );
            this.currentCompanyIndex = currentIndex;
            this.toggleSelect = !this.toggleSelect;
            this.selectDropDown.emit(event);
            this.selectValue.emit(event);
        }

        this.selectedDropdown = false;
    }

    public showDropdown(): void {
        if (this._optionsCompany?.length > 1) this.selectedDropdown = true;
    }

    public onActionChange(action: string): void {
        let currentIndex = this._optionsCompany?.findIndex(
            (comp) => comp.id === this.companyData.id
        );

        switch (action) {
            case SETTINGS_ARROW_ACTIONS.PREVIOUS: {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    const data = this._optionsCompany[currentIndex];
                    this.currentCompanyIndex = currentIndex;
                    this.onSelectItem(data);
                }
                break;
            }
            case SETTINGS_ARROW_ACTIONS.NEXT: {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this._optionsCompany?.length > currentIndex
                ) {
                    const data = this._optionsCompany[currentIndex];
                    this.currentCompanyIndex = currentIndex;
                    this.onSelectItem(data);
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public changeFontSizeLogo(): void {
        const element = this?.logoText?.nativeElement;
        const textContent = element?.innerText;
        const numberOfLettersAndSpaces = textContent?.length;

        if (numberOfLettersAndSpaces <= 12) {
            this.fontSizeLogo = SETINGS_ENUMS.SIXTY;
        } else if (numberOfLettersAndSpaces <= 16) {
            this.fontSizeLogo = SETINGS_ENUMS.FOURTY_EIGHT;
        } else if (numberOfLettersAndSpaces <= 25) {
            this.fontSizeLogo = SETINGS_ENUMS.THIRTY_TWO;
        } else if (numberOfLettersAndSpaces <= 35) {
            this.fontSizeLogo = SETINGS_ENUMS.TWENTY_THREE;
        } else {
            this.fontSizeLogo = SETINGS_ENUMS.TWENTY;
        }
    }

    public deleteDivisionCompanyById(id: number): void {
        this.settingsCompanyService.deleteCompanyDivisionById(id).subscribe();
    }

    public onDeleteDivisionCompany(): void {
        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
                id: this.companyData.id,
                template: 'company',
                type: 'delete',
                image: false,
            }
        );
    }

    public setIndexCompany(): void {
        let activeIndex = 0;
        this._optionsCompany.map((item, index) => {
            if (item.active) activeIndex = index;
        });

        this.currentCompanyIndex = activeIndex;
    }

    ngOnDestroy(): void {}
}
