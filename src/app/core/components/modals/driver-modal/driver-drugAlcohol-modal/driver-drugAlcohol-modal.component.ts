import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DriverListResponse,
  DriverResponse,
  GetTestModalResponse,
  TestResponse,
} from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';

import { DriverTService } from '../../../driver/state/driver.service';
import { TestTService } from '../../../driver/state/test.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { FormService } from '../../../../services/form/form.service';
import {
  convertDateToBackend,
  convertDateFromBackend,
} from '../../../../utils/methods.calculations';

@Component({
  selector: 'app-driver-drugAlcohol-modal',
  templateUrl: './driver-drugAlcohol-modal.component.html',
  styleUrls: ['./driver-drugAlcohol-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class DriverDrugAlcoholModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public drugForm: FormGroup;

  public isFormDirty: boolean;

  public modalName: string = null;

  public testTypes: any[] = [];
  // Reasons
  public reasons: any[] = [];
  public alcoholReasons: any[] = [];
  public drugReasons: any[] = [];
  // -------
  public testResults: any[] = [];

  public selectedTestType: any = null;
  public selectedReasonType: any = null;
  public selectedTestResult: any = null;

  public labelsDrivers: any[] = [];
  public selectedDriver: any = null;

  public documents: any[] = [];
  public fileModified: boolean = false;
  public filesForDelete: any[] = [];

  private destroy$ = new Subject<void>();

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

    if (this.editData) {
      this.getDriverById(this.editData.id);
      if (this.editData.type === 'edit-drug') {
        this.getTestById(this.editData.file_id);
      }
    } else {
      this.getListOfDrivers();
      this.drugForm.get('driver').setValidators(Validators.required);
    }
  }

  private createForm() {
    this.drugForm = this.formBuilder.group({
      driver: [null],
      testType: [null, Validators.required],
      testReasonId: [null, Validators.required],
      testingDate: [null, Validators.required],
      result: [null, Validators.required],
      note: [null],
      files: [null],
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
        if (this.editData?.type === 'edit-drug') {
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
          this.alcoholReasons = res.alcoholTestReasons;
          this.drugReasons = res.drugTestReasons;
          this.testResults = res.testResults;
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
          event ? true : false
        );

        if (this.selectedTestType.name.toLowerCase() === 'drug') {
          this.reasons = this.drugReasons;
        } else {
          this.reasons = this.alcoholReasons;
        }
        break;
      }
      case 'reason': {
        this.selectedReasonType = event;
        break;
      }
      case 'driver': {
        if (event) {
          this.selectedDriver = event;
          this.modalName = this.selectedDriver.name;
        } else {
          this.modalName = null;
        }
        break;
      }
      case 'result': {
        this.selectedTestResult = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;

    if (event.action == 'delete') {
      this.drugForm.patchValue({
        files: null,
      });

      this.filesForDelete.push(event.deleteId);

      this.fileModified = true;
    }
  }

  public updateTest() {
    const { testingDate, driver, note } = this.drugForm.value;
    const documents = this.documents.map((item) => {
      return item.realFile;
    });
    const newData: any = {
      id: this.editData.file_id,
      testingDate: convertDateToBackend(testingDate),
      testReasonId: this.selectedReasonType.id,
      testType: this.selectedTestType.id,
      result: this.selectedTestResult ? this.selectedTestResult.id : null,
      note: note,
      files: documents ? documents : this.drugForm.value.files,
      filesForDeleteIds: this.filesForDelete,
    };
    console.log('update test: ', newData);
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
    const { testingDate, driver, note } = this.drugForm.value;
    const documents = this.documents.map((item) => {
      return item.realFile;
    });
    const newData: any = {
      driverId: this.selectedDriver ? this.selectedDriver.id : this.editData.id,
      testingDate: convertDateToBackend(testingDate),
      testReasonId: this.selectedReasonType.id,
      testType: this.selectedTestType.id,
      result: this.selectedTestResult ? this.selectedTestResult.id : null,
      note: note,
      files: documents,
    };
    console.log('add test: ', newData);
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

  public getTestById(id: number) {
    this.testService
      .getTestById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TestResponse) => {
          this.drugForm.patchValue({
            testType: res.testType.name,
            testReasonId: res.testReason ? res.testReason.name : null,
            result: res.result ? res.result.name : null,
            testingDate: convertDateFromBackend(res.testingDate),
            note: res.note,
          });
          this.selectedTestType = res.testType;
          this.selectedReasonType = res.testReason;

          if (this.selectedTestType.name.toLowerCase() === 'drug') {
            this.reasons = this.drugReasons;
          } else {
            this.reasons = this.alcoholReasons;
          }
        },
        error: () => {
          this.notificationService.error("Can't get Test", 'Error:');
        },
      });
  }

  public getListOfDrivers() {
    this.driverService
      .getDrivers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DriverListResponse) => {
          console.log('list of drivers: ', res);
          this.labelsDrivers = res.pagination.data.map((item) => {
            return {
              id: item.id,
              name: item.fullName,
            };
          });
        },
        error: () => {
          this.notificationService.error("Can't load list of drivers", 'Error');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
