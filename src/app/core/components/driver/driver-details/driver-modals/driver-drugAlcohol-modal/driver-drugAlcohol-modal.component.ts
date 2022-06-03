import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreateTestCommand,
  DriverResponse,
  EditTestCommand,
  GetTestModalResponse,
  TestResponse,
} from 'appcoretruckassist';
import moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DriverTService } from '../../../state/driver.service';
import { TestTService } from '../../../state/test.service';
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
    private driverService: DriverTService,
    private testService: TestTService,
    private inputService: TaInputService,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getDrugDropdowns();
    this.testStateChange();
    this.getDriverById(this.editData.id);
    if (this.editData.type === 'edit-drug') {
      this.getTestById();
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

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.drugForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.drugForm.invalid) {
          this.inputService.markInvalid(this.drugForm);
          return;
        }
        if (this.editData.type === 'edit-drug') {
          this.updateTest();
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addTest();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  private getDriverById(id: number) {
    this.driverService
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
    this.testService
      .getTestDropdowns()
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

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'test': {
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
        break;
      }
      case 'reason': {
        this.selectedReasonType = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event: any) {
    console.log(event);
  }

  public updateTest() {
    const { testingDate } = this.drugForm.value;

    const newData: EditTestCommand = {
      id: this.editData.file_id,
      ...this.drugForm.value,
      testingDate: new Date(testingDate).toISOString(),
      testReasonId: this.selectedReasonType.id,
      testType: this.selectedTestType.id,
    };

    this.testService
      .updateTest(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Test successfully added.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Test can't be added.", 'Error:');
        },
      });
  }

  public addTest() {
    const { testingDate } = this.drugForm.value;

    const newData: CreateTestCommand = {
      driverId: this.editData.id,
      ...this.drugForm.value,
      testingDate: new Date(testingDate).toISOString(),
      testReasonId: this.selectedReasonType.id,
      testType: this.selectedTestType.id,
    };

    this.testService
      .addTest(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Test successfully added.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Test can't be added.", 'Error:');
        },
      });
  }

  public getTestById() {
    this.testService
      .getTestById(this.editData.file_id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: TestResponse) => {
          this.drugForm.patchValue({
            testType: res.testType.name,
            testReasonId: res.testReason.reason,
            testingDate: moment(new Date(res.testingDate)).format('YYYY-MM-DD'),
            note: res.note,
          });
          this.selectedTestType = res.testType;
          this.selectedReasonType = res.testReason;
        },
        error: () => {
          this.notificationService.error("Can't get Test", 'Error:');
        },
      });
  }

  ngOnDestroy(): void {}
}
