import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreateTestCommand,
  DriverResponse,
  EditTestCommand,
  GetTestModalResponse,
  TestResponse,
} from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';

import { DriverTService } from '../../../state/driver.service';
import { TestTService } from '../../../state/test.service';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../../services/notification/notification.service';
import { FormService } from '../../../../../services/form/form.service';
import {
  convertDateToBackend,
  convertDateFromBackend,
} from '../../../../../utils/methods.calculations';

@Component({
  selector: 'app-driver-drugAlcohol-modal',
  templateUrl: './driver-drugAlcohol-modal.component.html',
  styleUrls: ['./driver-drugAlcohol-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class DriverDrugAlcoholModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
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

  public isFormDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverTService,
    private testService: TestTService,
    private inputService: TaInputService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private formService: FormService
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

    this.formService.checkFormChange(this.drugForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.drugForm.invalid) {
          this.inputService.markInvalid(this.drugForm);
          return;
        }
        if (this.editData.type === 'edit-drug') {
          if (this.isFormDirty) {
            this.updateTest();
            this.modalService.setModalSpinner({ action: null, status: true });
          }
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
      .pipe(takeUntil(this.destroy$))
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetTestModalResponse) => {
          this.testTypes = res.testTypes;
          this.alcoholTests = res.alcoholTestReasons;
          this.drugTests = res.drugTestReasons;
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
      .valueChanges.pipe(takeUntil(this.destroy$))
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
    this.documents = event.files;
  }

  public updateTest() {
    const { testingDate } = this.drugForm.value;

    const newData: EditTestCommand = {
      id: this.editData.file_id,
      ...this.drugForm.value,
      testingDate: convertDateToBackend(testingDate),
      testReasonId: this.selectedReasonType.id,
      testType: this.selectedTestType.id,
    };

    this.testService
      .updateTest(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Test successfully added.',
            'Success:'
          );
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
      testingDate: convertDateToBackend(testingDate),
      testReasonId: this.selectedReasonType.id,
      testType: this.selectedTestType.id,
    };

    this.testService
      .addTest(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Test successfully added.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Test can't be added.", 'Error:');
        },
      });
  }

  public getTestById() {
    this.testService
      .getTestById(this.editData.file_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TestResponse) => {
          this.drugForm.patchValue({
            testType: res.testType.name,
            testReasonId: res.testReason.id,
            testingDate: convertDateFromBackend(res.testingDate),
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
