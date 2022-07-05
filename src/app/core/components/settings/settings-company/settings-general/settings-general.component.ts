import { SettingsStoreService } from './../../state/settings.service';
import {
  ChangeDetectorRef,
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
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { CompanyResponse } from 'appcoretruckassist';
@Component({
  selector: 'app-settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DetailsPageService],
})
export class SettingsGeneralComponent implements OnInit, OnDestroy {
  public isAccountVisible: boolean = false;
  public inputFormControl: FormControl = new FormControl();
  @Input() public optionsCompany: any[] = [];
  public optionsDivisonId: number;
  @Output() public selectDropDown= new EventEmitter<boolean>();
  public toggleSelect:boolean;
  @Output() selectValue = new EventEmitter<string>();
  @Input() public companyData: any;
  constructor(
    private settingsStoreService: SettingsStoreService,
  ) {}
 
  ngOnInit(): void {
   console.log(this.companyData);
   
    
  }
  public onAction(modal: { type: boolean; modalName: string; action: string }) {
    this.settingsStoreService.onModalAction(modal);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }
  public onPickItem(value): void {
    this.toggleSelect=true;
    this.selectDropDown.emit(value);
  }
  public onSelectItem(event: any) {  
    this.toggleSelect=!this.toggleSelect
    this.selectDropDown.emit(event);
    this.selectValue.emit(event)
  }
  ngOnDestroy(): void {}
}
