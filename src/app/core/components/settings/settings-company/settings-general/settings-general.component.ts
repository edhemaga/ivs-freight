import { SettingsCompanyService } from '../../state/company-state/settings-company.service';
import {
    AfterViewInit,
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

// pipes
import { DetailsActiveItemPipe } from 'src/app/core/pipes/detailsActiveItem.pipe';

// enums
import { SETINGS_ENUMS } from '../utils/enums/settings.enum';

@Component({
    selector: 'app-settings-general',
    templateUrl: './settings-general.component.html',
    styleUrls: ['./settings-general.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DetailsPageService, DetailsActiveItemPipe],
})
export class SettingsGeneralComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
    @ViewChild('logoText', { static: false }) logoText: ElementRef;

    @ViewChild('logoBox', { static: false }) logoBox: ElementRef;

    @Input() public optionsCompany: any[] = [];
    @Input() public companyData: any;

    @Output() selectValue = new EventEmitter<string>();
    @Output() selectDropDown = new EventEmitter<boolean>();

    public isAccountVisible: boolean = false;
    public inputFormControl: UntypedFormControl = new UntypedFormControl();
    public optionsDivisonId: number;

    public toggleSelect: boolean;
    public timeZoneName: string = '';
    public companyDivision: boolean = false;
    public hasArrow: boolean;
    public changeFont: boolean;
    public selectedDropdown: boolean = false;
    public currentCompanyIndex;

    public fontSizeLogo = SETINGS_ENUMS.SIXTY;

    constructor(
        private settingsCompanyService: SettingsCompanyService,
        public imageBase64Service: ImageBase64Service
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
    }

    ngOnInit(): void {
        let divisionArray = [];

        this.optionsCompany?.map((item) => {
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

        let currentIndex = this.optionsCompany?.findIndex(
            (comp) => comp.id === this.companyData.id
        );
        this.currentCompanyIndex = currentIndex;
    }

    ngAfterViewInit(): void {
        this.changeFontSizeLogo();
    }

    public changeFontSizeLogo(): void {
        if (this.logoText) {
            const element = this.logoText.nativeElement;

            element.style.fontSize = SETINGS_ENUMS.SIXTY;
            element.style.whiteSpace = SETINGS_ENUMS.NOWRRAP;
            element.style.lineHeight = SETINGS_ENUMS.SIXTY;

            if (element.offsetWidth > this.logoBox.nativeElement.offsetWidth) {
                element.style.fontSize = SETINGS_ENUMS.FOURTY_EIGHT;
                element.style.lineHeight = SETINGS_ENUMS.FOURTY_EIGHT;
                element.style.whiteSpace = SETINGS_ENUMS.NOWRRAP;

                if (
                    element.offsetWidth > this.logoBox.nativeElement.offsetWidth
                ) {
                    element.style.fontSize = SETINGS_ENUMS.THIRTY_TWO;
                    element.style.lineHeight = SETINGS_ENUMS.THIRTY_TWO;
                    element.style.whiteSpace = SETINGS_ENUMS.NOWRRAP;

                    if (
                        element.offsetWidth >
                        this.logoBox.nativeElement.offsetWidth
                    ) {
                        element.style.fontSize = SETINGS_ENUMS.TWENTY_THREE;
                        element.style.lineHeight = SETINGS_ENUMS.TWENTY_THREE;
                        element.style.whiteSpace = SETINGS_ENUMS.NOWRRAP;

                        if (
                            element.offsetWidth >
                            this.logoBox.nativeElement.offsetWidth
                        ) {
                            element.style.fontSize = SETINGS_ENUMS.TWENTY;
                            element.style.lineHeight = SETINGS_ENUMS.TWENTY;
                            element.style.whiteSpace = SETINGS_ENUMS.PRE_LINE;
                        }
                    }
                }
            }
        }
    }

    public timeZoneFormat(mod) {
        return mod.substring(0, 7);
    }

    public onAction(modal: { modalName: string; type: string; company?: any }) {
        this.settingsCompanyService.onModalAction(modal);
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    public onPickItem(value): void {
        if (this.hasArrow) {
            this.toggleSelect = true;
            this.selectDropDown.emit(value);
        }
    }
    public onSelectItem(event: any) {
        if (event) {
            let currentIndex = this.optionsCompany?.findIndex(
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
        if (this.optionsCompany?.length > 1) {
            this.selectedDropdown = true;
        }
    }

    public onActionChange(action: any) {
        let currentIndex = this.optionsCompany?.findIndex(
            (comp) => comp.id === this.companyData.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    let data = this.optionsCompany[currentIndex];
                    this.currentCompanyIndex = currentIndex;
                    this.onSelectItem(data);
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.optionsCompany?.length > currentIndex
                ) {
                    let data = this.optionsCompany[currentIndex];
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

    ngOnDestroy(): void {}
}
