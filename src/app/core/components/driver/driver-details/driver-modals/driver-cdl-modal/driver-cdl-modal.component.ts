import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CdlModalService } from './cdl-modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DriverResponse, GetCdlModalResponse } from 'appcoretruckassist';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';

@Component({
  selector: 'app-driver-cdl-modal',
  templateUrl: './driver-cdl-modal.component.html',
  styleUrls: ['./driver-cdl-modal.component.scss'],
})
export class DriverCdlModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public cdlForm: FormGroup;

  public modalName: string = null

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
    private inputService: TaInputService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCdlDropdowns();
    this.countryStateChange();

    if (this.editData) {
      this.getDriverById(this.editData.id);
    }
  }

  private createForm() {
    this.cdlForm = this.formBuilder.group({
      cdlNumber: [null, Validators.required],
      issueDate: [null, Validators.required],
      expDate: [null, Validators.required],
      classType: [null, Validators.required],
      countryType: [null, Validators.required],
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
    this.inputService.changeValidators(this.cdlForm.get('stateId'), false);

    if (this.selectedCountryType.name.toLowerCase() === 'us') {
      this.stateTypes = this.usStates;
    } else {
      this.stateTypes = this.canadaStates;
    }
  }

  private countryStateChange() {
    this.cdlForm
      .get('countryType')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(this.cdlForm.get('stateId'));
        } else {
          this.inputService.changeValidators(
            this.cdlForm.get('stateId'),
            false
          );
        }
      });
  }

  public onSelectStateType(event: any) {}

  private getCdlDropdowns() {
    this.cdlModalService
      .getCdlDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: GetCdlModalResponse) => {
          this.canadaStates = res.canadaStates.map((item) => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName,
            };
          });
          this.usStates = res.usStates.map((item) => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName,
            };
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

  private getDriverById(id: number) {
    this.cdlModalService
      .getDriverById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: DriverResponse) => {
          this.modalName = res.firstName.concat(" ",res.lastName);
        },
        error: () => {
          this.notificationService.error("Driver can't be loaded.", 'Error:');
        },
      });
  }

  public onFilesEvent(event: any) {

  }

  ngOnDestroy(): void {}
}
