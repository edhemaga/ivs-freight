import { HttpErrorResponse } from '@angular/common/http';
import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { FILE_TABLES } from 'src/app/const';
import {DriverData, TestData } from 'src/app/core/model/driver';
import { MetaData } from 'src/app/core/model/enums';
import { ClonerService } from 'src/app/core/services/cloner.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { MetaDataService } from 'src/app/core/services/shared/meta-data.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner/spinner.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-driver-drugAlcohol-modal',
  templateUrl: './driver-drugAlcohol-modal.component.html',
  styleUrls: ['./driver-drugAlcohol-modal.component.scss']
})
export class DriverDrugAlcoholModalComponent implements OnInit, OnDestroy {

  @Input() inputData: any;
  @ViewChild('note') note: ElementRef;
  @ViewChild('dropZone') dropZoneRef: ElementRef;
  modalTitle: string;
  attachments: any = [];
  test: TestData = null;
  testData: TestData[] = [];
  types: MetaData[] = [
    {
      domain: 'driver',
      value: 'Drug',
      key: 'drugReason',
    },
    {
      domain: 'driver',
      value: 'Alcohol',
      key: 'alcoholReason',
    },
  ];
  reasons: MetaData[] = [];
  loading = true;
  driver: DriverData = null;
  testForm: FormGroup;
  showNote = false;
  textRows = 1;
  loaded = false;
  files = [];
  private destroy$: Subject<void> = new Subject<void>();
  public showDropZone: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private notification: NotificationService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private metadataService: MetaDataService,
    private storageService: StorageService,
    private clonerService: ClonerService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle =
      this.inputData.data.driver && this.inputData.data.prefix
        ? this.inputData.data.driver.fullName + ' - '
        : '';
    this.modalTitle += this.inputData.data.type === 'edit' ? 'Edit Test' : 'New Test';
    if (this.inputData.data.type === 'new') {
      this.loaded = true;
    }
    this.loadTestData();

    this.shared.emitDeleteFiles.pipe(takeUntil(this.destroy$)).subscribe((files: any) => {
      if (files.success) {
        const removedFile = files.success[0];
        this.test.attachments = this.test.attachments.filter(
          (file: any) => file.fileItemGuid !== removedFile.guid
        );
        this.manageTest(true);
      }
    });
  }

  loadTestData() {
    this.driver = this.inputData.data.driver ? this.inputData.data.driver : null;
    if (
      this.inputData.data.driver &&
      (this.inputData?.data?.driver?.doc?.testData || this.inputData?.data?.driver?.testData)
    ) {
      this.testData =
        this.inputData?.data?.driver?.doc?.testData || this.inputData?.data?.driver?.testData;
      if (this.inputData.data.type === 'edit') {
        const test = this.testData
          ? this.testData.find((l) => l.id === this.inputData.data.testId)
          : null;
        this.attachments = test.attachments;
        this.setTestData(test);
      } else {
        this.setTestData(null);
      }
    } else {
      this.setTestData(null);
    }
  }

  createForm() {
    this.testForm = this.formBuilder.group({
      testingDate: [null, Validators.required],
      reason: [null, Validators.required],
      testType: [null, Validators.required],
      note: [''],
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  setTestData(test: TestData) {
    this.test = test;
    if (this.test) {
      this.testForm.controls.testingDate.setValue(new Date(test.testingDate));
      this.testForm.controls.reason.setValue(test.reason);
      this.testForm.controls.testType.setValue(test.type);
      this.getReasons(test.type);
      this.testForm.controls.note.setValue(
        test.note !== null ? test.note.replace(/<\/?[^>]+(>|$)/g, '') : ''
      );
      if (test.note.length > 0) {
        this.handleHeight(test.note !== null ? test.note.replace(/<\/?[^>]+(>|$)/g, '') : '');
        this.showNote = true;
      }
      this.shared.touchFormFields(this.testForm);
    } else {
      this.testForm.controls.testingDate.setValue(null);
      this.testForm.controls.testType.setValue(null);
      this.testForm.controls.reason.setValue(null);
      this.testForm.controls.note.setValue('');
    }

    if (!this.testForm.controls.testType.value) {
      this.testForm.controls.reason.disable();
    }

    this.loading = false;
  }

  manageTest(keepModal: boolean) {
    if (!this.shared.markInvalid(this.testForm)) {
      return false;
    }

    const test: TestData = {
      id: this.test ? this.test.id : uuidv4(),
      reason: this.testForm.controls.reason.value,
      type: this.testForm.controls.testType.value,
      testingDate: this.testForm.controls.testingDate.value,
      note: this.testForm.controls.note.value,
      attachments: this.test && this.test.attachments ? this.test.attachments : [],
    };

    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    const index = this.testData.findIndex((l) => l.id === test.id);
    const tempData = this.testData;

    if (index !== -1) {
      tempData[index] = test;
    } else {
      tempData.push(test);
    }
    saveData.doc = {
      mvrData: this.driver.doc?.mvrData || this.driver?.mvrData,
      additionalData: this.driver.doc?.additionalData || this.driver?.additionalData,
      licenseData: this.driver.doc?.licenseData || this.driver?.licenseData,
      workData: this.driver.doc?.workData || this.driver?.workData,
      testData: tempData,
      medicalData: this.driver.doc?.medicalData || this.driver?.medicalData,
    };
    saveData.doc.testData = tempData;
    saveData.owner = undefined;
    saveData.driverUser = undefined;
    saveData.driverUserId = undefined;
    this.spinner.show(true);

    const newFiles = this.shared.getNewFiles(this.files);
    // if (newFiles.length > 0) {
    //   this.storageService
    //     .uploadFiles(
    //       this.driver.guid,
    //       FILE_TABLES.DRIVER,
    //       this.driver.id,
    //       this.files,
    //       'drug-alcohol',
    //       test.id.toString()
    //     )
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(
    //       (resp: any) => {
    //         const tempDrugAttachments = [];
    //         resp.success.forEach((element) => {
    //           tempDrugAttachments.push(element);
    //         });
    //         test.attachments = tempDrugAttachments;
    //         this.notification.success(`Attachments successfully uploaded.`, ' ');
    //         this.driverService
    //           .updateDriverData(saveData, this.driver.id)
    //           .pipe(takeUntil(this.destroy$))
    //           .subscribe(
    //             (result: any) => {
    //               if (result) {
    //                 this.shared.emitRefreshAfterUpdate.emit();
    //                 if (this.inputData.data.type === 'edit') {
    //                   this.notification.success('Test has been updated.', 'Success:');
    //                 } else {
    //                   this.notification.success('Test has been added.', 'Success:');
    //                 }
    //                 if (!keepModal) {
    //                   this.resetModalData();
    //                 }
    //                 this.spinner.show(false);
    //               }
    //             },
    //             (error: HttpErrorResponse) => {
    //               this.shared.handleError(error);
    //             }
    //           );
    //       },
    //       (error: HttpErrorResponse) => {
    //         this.shared.handleError(error);
    //       }
    //     );
    // } else {
    //   this.driverService
    //     .updateDriverData(saveData, this.driver.id)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(
    //       (result: any) => {
    //         if (this.inputData.data.type === 'edit') {
    //           this.notification.success('Test has been updated.', 'Success:');
    //         } else {
    //           this.notification.success('Test has been added.', 'Success:');
    //         }
    //         if (!keepModal) {
    //           this.resetModalData();
    //         }
    //         this.spinner.show(false);
    //       },
    //       (error: HttpErrorResponse) => {
    //         this.shared.handleError(error);
    //       }
    //     );
    // }
  }

  resetModalData() {
    this.testForm.reset();
    this.testForm.controls.reason.setValue(null);
    this.testForm.controls.testType.setValue(null);
    this.testForm.controls.testingDate.setValue('');
    this.closeModal();
  }

  setFiles(files: any) {
    this.files = files;
  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.manageTest(false);
    }
  }

  getReasons(selectedType: MetaData, reset?: boolean) {
    this.reasons = [];
    if (selectedType) {
      this.spinner.show(true);
      this.metadataService
        .getMetaDataByDomainKey(selectedType.domain, selectedType.key)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (metadata: MetaData[]) => {
            this.reasons = metadata;
            this.loaded = true;
            if (reset) {
              this.testForm.controls.reason.reset();
              this.testForm.controls.reason.enable();
            }
            this.spinner.show(false);
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else {
      this.testForm.controls.reason.reset();
      this.testForm.controls.reason.disable();
    }
  }

  openNote() {
    if (this.showNote === true) {
      this.showNote = false;
      this.testForm.get('note').setValue('');
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public closeDrugModal() {
    this.activeModal.close();
  }

  public openDropZone() {
    this.showDropZone = !this.showDropZone;
    if (this.showDropZone) {
      const timeout = setTimeout(() => {
        this.dropZoneRef.nativeElement.focus();
        clearTimeout(timeout);
      }, 250);
    }
  }
  public saveDriverDoc(logoImage: string) {
    this.testForm.get('driverDoc').setValue({
      id: uuidv4(),
      src: logoImage,
    });
  }
}
function uuidv4(): number {
    throw new Error('Function not implemented.');
}

