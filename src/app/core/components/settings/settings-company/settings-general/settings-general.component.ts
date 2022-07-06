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
export class SettingsGeneralComponent implements OnInit, OnDestroy {
  @Input() public optionsCompany: any[] = [];
  @Input() public companyData: any;

  @Output() selectValue = new EventEmitter<string>();
  @Output() public selectDropDown = new EventEmitter<boolean>();

  public isAccountVisible: boolean = false;
  public inputFormControl: FormControl = new FormControl();
  public optionsDivisonId: number;
  public toggleSelect: boolean;
  public timeZoneName: string = '';

  constructor(
    private settingsStoreService: SettingsStoreService,
    private detailsActiveItemPipe: DetailsActiveItemPipe
  ) {}

  ngOnInit(): void {
    console.log(this.companyData);
    this.timeZoneName = this.companyData.timeZone.name.substring(0, 7);
  }

  public onAction(modal: {
    modalName: string;
    action: string;
    companyDevision?: any;
  }) {
    this.settingsStoreService.onModalAction(modal);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  public onPickItem(value): void {
    this.toggleSelect = true;
    this.selectDropDown.emit(value);
  }

  public onSelectItem(event: any) {
    this.toggleSelect = !this.toggleSelect;
    this.selectValue.emit(event);
    this.selectDropDown.emit(event);
  }

  ngOnDestroy(): void {}
}
