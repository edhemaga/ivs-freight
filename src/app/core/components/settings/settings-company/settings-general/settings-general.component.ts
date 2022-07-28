import { SettingsStoreService } from './../../state/settings.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { DetailsActiveItemPipe } from 'src/app/core/pipes/detailsActiveItem.pipe';

@Component({
  selector: 'app-settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DetailsPageService, DetailsActiveItemPipe],
})
export class SettingsGeneralComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public optionsCompany: any[] = [];
  @Input() public companyData: any;

  @Output() selectValue = new EventEmitter<string>();
  @Output() selectDropDown = new EventEmitter<boolean>();

  public isAccountVisible: boolean = false;
  public inputFormControl: FormControl = new FormControl();
  public optionsDivisonId: number;

  public toggleSelect: boolean;
  public timeZoneName: string = '';
  public companyDivision: boolean = false;
  public hasArrow: boolean;

  constructor(private settingsStoreService: SettingsStoreService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.companyData?.currentValue?.divisions.length < 1) {
      this.companyDivision = true;
    } else {
      this.companyDivision = false;
    }
    if (
      !changes?.companyData?.firstChange &&
      changes?.companyData?.currentValue !== changes?.companyData?.previousValue
    ) {
      this.companyData = changes?.companyData?.currentValue;
    }
  }
  ngOnInit(): void {
    let divisionArray = [];
    this.optionsCompany.map((item) => {
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

    if (this.companyData.timeZone.name) {
      this.timeZoneName = this.companyData.timeZone.name.substring(0, 7);
    }
  }

  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsStoreService.onModalAction(modal);
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
    this.toggleSelect = !this.toggleSelect;
    this.selectDropDown.emit(event);
    this.selectValue.emit(event);
  }

  ngOnDestroy(): void {}
}
