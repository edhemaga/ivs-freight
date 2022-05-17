import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverResponse, GetTestModalResponse } from 'appcoretruckassist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DrugModalService } from './drug-modal.service';
@Component({
  selector: 'app-driver-drugAlcohol-modal',
  templateUrl: './driver-drugAlcohol-modal.component.html',
  styleUrls: ['./driver-drugAlcohol-modal.component.scss'],
})
export class DriverDrugAlcoholModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public drugForm: FormGroup;

  public modalName: string = null;

  public documents: any[] = [];
  public testTypes: any[] = [];
  public alcoholTests: any[] = [];
  public drugTests: any[] = [];

  public reasonTypes: any[] = [];

  public selectedTestType: any = null;
  public selectedReasonType: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private drugModalService: DrugModalService,
    private inputService: TaInputService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getDrugDropdowns();
    this.testStateChange();

    if (this.editData) {
      this.getDriverById(this.editData.id);
    }
  }

  private createForm() {
    this.drugForm = this.formBuilder.group({
      testType: [null, Validators.required],
      testReasonId: [null, Validators.required],
      testingDate: [null, Validators.required],
      note: [null],
    });
  }

  public onModalAction($event) {}

  private getDriverById(id: number) {
    this.drugModalService
      .getDriverById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: DriverResponse) => {
          this.modalName = res.firstName.concat(' ', res.lastName);
        },
        error: () => {
          this.notificationService.error("Driver can't be loaded.", 'Error:');
        },
      });
  }

  private getDrugDropdowns() {
    this.drugModalService
      .getDrugDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: GetTestModalResponse) => {
          this.testTypes = res.testTypes;
          this.alcoholTests = res.alcoholTestReasons.map((item) => {
            return {
              id: item.id,
              name: item.reason,
            };
          });
          this.drugTests = res.drugTestReasons.map((item) => {
            return {
              id: item.id,
              name: item.reason,
            };
          });
        },
        error: () => {
          this.notificationService.error(
            "Drug's dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
  }

  private testStateChange() {
    this.drugForm
      .get('testType')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(this.drugForm.get('testReasonId'));
        } else {
          this.inputService.changeValidators(
            this.drugForm.get('testReasonId'),
            false
          );
        }
      });
  }

  public onSelectTestType(event: any) {
    this.selectedTestType = event;
    this.inputService.changeValidators(
      this.drugForm.get('testReasonId'),
      false
    );
    if (this.selectedTestType.name.toLowerCase() === 'drug') {
      this.reasonTypes = this.drugTests;
    } else {
      this.reasonTypes = this.alcoholTests;
    }
  }

  public onSelectReasonType(event: any) {
    this.selectedReasonType = event;
  }

  ngOnDestroy(): void {}
}
