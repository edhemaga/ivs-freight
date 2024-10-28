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
import { DetailsPageService } from '@shared/services/details-page.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ModalService } from '@shared/services/modal.service';
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';

// pipes
import { DetailsActiveItemPipe } from '@shared/pipes/details-active-item.pipe';

// enums
import { SettingsGeneralStringEnum } from '@pages/settings/enums/settings-general-string.enum';
import { ArrowActionsStringEnum } from '@shared/enums/arrow-actions-string.enum';

//Components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

//Models
import { SettingsCompanyProperties } from '@pages/settings/models/settings-company-properties.model';
import { Subject, takeUntil } from 'rxjs';

// routes
import { SettingsGeneralSvgRoutes } from '@pages/settings/pages/settings-company/components/settings-general/utils/svg-routes';

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

    @Input() public set optionsCompany(value: SettingsCompanyProperties[]) {
        this._optionsCompany = value;
        this.setIndexCompany();
    }
    @Input() public companyData: any; //leave any for now

    @Output() selectValue = new EventEmitter<string>();
    @Output() selectDropDown = new EventEmitter<boolean>();

    public _optionsCompany: SettingsCompanyProperties[];
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

    public svgRoutes = SettingsGeneralSvgRoutes;

    private destroy$ = new Subject<void>();

    constructor(
        private settingsCompanyService: SettingsCompanyService,
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
                    if (
                        res?.type === SettingsGeneralStringEnum.DELETE &&
                        res.template === SettingsGeneralStringEnum.COMPANY
                    )
                        this.deleteDivisionCompanyById(res.id);
                },
            });
    }

    public timeZoneFormat(mod: string): string {
        return mod.substring(0, 7);
    }

    public onAction(modal: {
        modalName: string;
        type: string;
        company?: SettingsCompanyProperties;
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
            case ArrowActionsStringEnum.PREVIOUS: {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    const data = this._optionsCompany[currentIndex];
                    this.currentCompanyIndex = currentIndex;
                    this.onSelectItem(data);
                }
                break;
            }
            case ArrowActionsStringEnum.NEXT: {
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
            this.fontSizeLogo = SettingsGeneralStringEnum.SIXTY;
        } else if (numberOfLettersAndSpaces <= 16) {
            this.fontSizeLogo = SettingsGeneralStringEnum.FOURTY_EIGHT;
        } else if (numberOfLettersAndSpaces <= 25) {
            this.fontSizeLogo = SettingsGeneralStringEnum.THIRTY_TWO;
        } else if (numberOfLettersAndSpaces <= 35) {
            this.fontSizeLogo = SettingsGeneralStringEnum.TWENTY_THREE;
        } else {
            this.fontSizeLogo = SettingsGeneralStringEnum.TWENTY;
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
