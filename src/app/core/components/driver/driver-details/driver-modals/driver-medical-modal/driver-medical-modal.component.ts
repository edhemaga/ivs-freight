import { HttpErrorResponse } from '@angular/common/http';
import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { Subject, takeUntil } from 'rxjs';
import { FILE_TABLES } from 'src/app/const';
import { DateFormatter } from 'src/app/core/helpers/dateFormatter';
import {DriverData, MedicalData } from 'src/app/core/model/driver';
import { ClonerService } from 'src/app/core/services/cloner.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner/spinner.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-driver-medical-modal',
  templateUrl: './driver-medical-modal.component.html',
  styleUrls: ['./driver-medical-modal.component.scss']
})
export class DriverMedicalModalComponent implements OnInit, OnDestroy {

  @Input() inputData: any;
  @ViewChild('note') note: ElementRef;
  @ViewChild('dropZone') dropZoneRef: ElementRef;
  loading: boolean;
  medicalForm: FormGroup;
  medical: MedicalData = null;
  medicalData: MedicalData[] = [];
  modalTitle: string;
  showNote = false;
  driver: DriverData = null;
  format: FormatSettings = environment.dateFormat;
  files = [];
  attachments: any = [];
  loaded = false;
  private destroy$: Subject<void> = new Subject<void>();
  public showDropZone: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private spinner: SpinnerService,
    private storageService: StorageService,
    private clonerService: ClonerService
  ) {
    this.loading = true;
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle =
      this.inputData.data.driver && this.inputData.data.prefix
        ? this.inputData.data.driver.fullName + ' - '
        : '';
    this.modalTitle += this.inputData.data.type === 'edit' ? 'Edit Medical' : 'Add Medical';
    this.loadMedicalData();

    this.shared.emitDeleteFiles.pipe(takeUntil(this.destroy$)).subscribe((files: any) => {
      if (files.success) {
        const removedFile = files.success[0];
        this.medical.attachments = this.medical.attachments.filter(
          (file: any) => file.fileItemGuid !== removedFile.guid
        );
        this.saveMedical(true);
      }
    });
  }

  createForm() {
    this.medicalForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  loadMedicalData() {
    this.driver = this.inputData.data.driver ? this.inputData.data.driver : null;
    if (
      this.inputData?.data?.driver &&
      (this.inputData?.data?.driver?.doc?.medicalData || this.inputData?.data?.driver?.medicalData)
    ) {
      this.medicalData =
        this.inputData?.data?.driver?.doc?.medicalData || this.inputData?.data?.driver?.medicalData;

      if (this.inputData.data.type === 'edit') {
        const medical = this.medicalData
          ? this.medicalData.find((l) => l.id === this.inputData.data.id)
          : null;
        this.attachments = medical.attachments;

        this.setMedicalData(medical);
      } else {
        this.setMedicalData(null);
      }
    } else {
      this.setMedicalData(null);
    }
  }

  setFiles(files: any) {
    this.files = files;
  }

  setMedicalData(medical: MedicalData) {
    this.loaded = true;
    this.medical = medical;
    if (medical) {
      this.medicalForm.controls.startDate.setValue(new Date(medical.startDate));
      this.medicalForm.controls.endDate.setValue(new Date(medical.endDate));
      this.shared.touchFormFields(this.medicalForm);
    } else {
      this.medicalForm.controls.startDate.setValue('');
      this.medicalForm.controls.endDate.setValue('');
    }
    this.loading = false;
  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.saveMedical(false);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  saveMedical(keepModal: boolean) {
    if (!this.shared.markInvalid(this.medicalForm)) {
      return false;
    }

    const medical: MedicalData = {
      id: this.medical ? this.medical.id : uuidv4(),
      startDate: this.medicalForm.controls.startDate.value,
      endDate: this.medicalForm.controls.endDate.value,
      attachments: this.medical && this.medical.attachments ? this.medical.attachments : [],
    };

    medical.startDate = DateFormatter.formatDate(medical.startDate.toString());
    medical.endDate = DateFormatter.formatDate(medical.endDate.toString());

    const saveData: DriverData = this.driver;
    const index = this.medicalData.findIndex((l) => l.id === medical.id);

    const tempData = this.medicalData;

    if (index !== -1) {
      tempData[index] = medical;
    } else {
      tempData.push(medical);
    }
    saveData.doc = {
      mvrData: this.driver.doc?.mvrData || this.driver?.mvrData,
      additionalData: this.driver.doc?.additionalData || this.driver?.additionalData,
      licenseData: this.driver.doc?.licenseData || this.driver?.licenseData,
      workData: this.driver.doc?.workData || this.driver?.workData,
      testData: this.driver.doc?.testData || this.driver?.testData,
      medicalData: tempData,
    };
    this.spinner.show(true);

    const newFiles = this.shared.getNewFiles(this.files);
    // if (newFiles.length > 0) {
    //   this.storageService
    //     .uploadFiles(
    //       this.driver.guid,
    //       FILE_TABLES.DRIVER,
    //       this.driver.id,
    //       this.files,
    //       'medical',
    //       medical.id.toString()
    //     )
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(
    //       (resp: any) => {
    //         const tempMedicalAttachments = [];
    //         resp.success.forEach((element) => {
    //           tempMedicalAttachments.push(element);
    //         });
    //         medical.attachments = tempMedicalAttachments;
    //         this.notification.success(`Attachments successfully uploaded.`, ' ');
    //         this.driverService
    //           .updateDriverData(saveData, this.driver.id)
    //           .pipe(takeUntil(this.destroy$))
    //           .subscribe(
    //             () => {
    //               this.shared.emitRefreshAfterUpdate.emit();
    //               if (this.inputData.data.type === 'edit') {
    //                 this.notification.success(`Medical has been updated.`, 'Success:');
    //               } else {
    //                 this.notification.success(`Medical has been added.`, 'Success:');
    //               }
    //               if (!keepModal) {
    //                 this.resetModalData();
    //               }
    //               this.spinner.show(false);
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
    //       () => {
    //         if (this.inputData.data.type === 'edit') {
    //           this.notification.success(`Medical has been updated.`, 'Success:');
    //         } else {
    //           this.notification.success(`Medical has been added.`, 'Success:');
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
    this.medicalForm.reset();
    this.medicalForm.controls.startDate.setValue('');
    this.medicalForm.controls.endDate.setValue('');
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.medicalForm.get('medicalDoc').setValue({
      id: uuidv4(),
      src: logoImage,
    });
  }
  openNote() {
    if (this.showNote === true) {
      this.showNote = false;
      this.medicalForm.get('note').setValue('');
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }
}

function uuidv4(): number {
    throw new Error('Function not implemented.');
}

