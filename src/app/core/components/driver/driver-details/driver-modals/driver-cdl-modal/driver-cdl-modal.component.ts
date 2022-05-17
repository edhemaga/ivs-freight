import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CdlModalService } from './cdl-modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { GetCdlModalResponse } from 'appcoretruckassist';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-driver-cdl-modal',
  templateUrl: './driver-cdl-modal.component.html',
  styleUrls: ['./driver-cdl-modal.component.scss'],
})
export class DriverCdlModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public cdlForm: FormGroup;

  public canadaStates: any[] = [];
  public usStates: any[] = [];
  public classTypes: any[] = [];
  public countryTypes: any[] = [];
  public endorsements: any[] = [];
  public restrictions: any[] = [];

  public stateTypes: any[] = [];

  public selectedClassType: any = null;
  public selectedCountryType: any = null;
  public selectedStateType: any = null;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cdlModalService: CdlModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCdlDropdowns();
  }

  private createForm() {
    this.cdlForm = this.formBuilder.group({
      cdlNumber: [null],
      issueDate: [null],
      expDate: [null],
      classType: [null],
      countryType: [null],
      stateId: [null],
      restrictions: [null],
      endorsements: [null],
      note: [null],
    });
  }

  public onModalAction(event: any) {}

  public onSelectClassType(event: any) {
    this.selectedClassType = event;
  }

  public onSelectCountryType(event: any) {
    this.selectedCountryType = event;
    console.log(this.selectedCountryType)
  }

  public onSelectStateType(event: any) {

  }

  private getCdlDropdowns() {
    this.cdlModalService
      .getCdlDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: GetCdlModalResponse) => {
          this.canadaStates = res.canadaStates.map(item => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName
            }
          });
          this.usStates = res.usStates.map(item => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName
            }
          });
          this.classTypes = res.classTypes;
          this.countryTypes = res.countryTypes;
          this.endorsements = res.endorsements;
          this.restrictions = res.restrictions;

        },
        error: () => {
          this.notificationService.error(
            "Cdl's dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
  }

  ngOnDestroy(): void {}
}
