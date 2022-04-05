import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import {forkJoin, Subject, takeUntil} from 'rxjs';
import {DriverData, EndorsementData, LicenseData, RestrictionData } from 'src/app/core/model/driver';
import { MetaData } from 'src/app/core/model/enums';
import { environment } from 'src/environments/environment';
import {SharedService} from "../../../../../services/shared/shared.service";
import {NotificationService} from "../../../../../services/notification/notification.service";
import {StorageService} from "../../../../../services/storage/storage.service";
import {SpinnerService} from "../../../../../services/spinner/spinner.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {MetaDataService} from "../../../../../services/shared/meta-data.service";
import {ClonerService} from "../../../../../services/cloner.service";
import {DateFormatter} from "../../../../../helpers/dateFormatter";
import {HttpErrorResponse} from "@angular/common/http";
import {FILE_TABLES} from "../../../../../../const";
import {DatePipe} from "@angular/common";
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-driver-cdl-modal',
  templateUrl: './driver-cdl-modal.component.html',
  styleUrls: ['./driver-cdl-modal.component.scss']
})
export class DriverCdlModalComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  @ViewChild('note') note: ElementRef;
  @ViewChild('dropZone') dropZoneRef: ElementRef;
  @Input() cardCount: number = 0;
  stateData: MetaData[];
  attachments: any = [];
  countryData: MetaData[];
  restrictionData: RestrictionData[];
  endorsementData: EndorsementData[];
  classData: MetaData[];
  lang = 'en';
  licenseForm: FormGroup;
  license: LicenseData = null;
  licenseData: LicenseData[] = [];
  modalTitle: string;
  driver: DriverData = null;
  loaded = false;
  format: FormatSettings = environment.dateFormat;
  showNote = false;
  files = [];
  public fomratType = /^[!@#$%^&()_+\=\[\]{};':"\\|,.<>\/?]*$/;
  public numOfSpaces = 0;
  private destroy$: Subject<void> = new Subject<void>();
  public showDropZone: boolean = true;


  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private datePipe: DatePipe,
    private storageService: StorageService,
    private metadataService: MetaDataService,
    private clonerService: ClonerService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle =
      this.inputData.data.driver && this.inputData.data.prefix
        ? this.inputData.data.driver.fullName + ' - '
        : '';
    this.modalTitle += this.inputData.data.type === 'edit' ? 'Edit CDL' : 'Add Licence';
    this.getLicenseData();

    this.shared.emitDeleteFiles.pipe(takeUntil(this.destroy$)).subscribe((files: any) => {
      if (files.success) {
        const removedFile = files.success[0];
        this.license.attachments = this.license.attachments.filter(
          (file: any) => file.fileItemGuid !== removedFile.guid
        );
        this.editLicense(true);
      }
    });
  }

  getLicenseData() {
    const classes$ = this.metadataService.getMetaDataByDomainKey('driver', 'class');
    const countries$ = this.metadataService.getMetaDataByDomainKey('driver', 'country');
    // const restrictions$ = this.driverService.getRestriction();
    // const endorsments$ = this.driverService.getEndorsement();


    // forkJoin([classes$, countries$, restrictions$, endorsments$])
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(
    //     ([classes, countries, restrictions, endorsments]: [
    //       MetaData[],
    //       MetaData[],
    //       RestrictionData[],
    //       EndorsementData[]
    //     ]) => {
    //       this.classData = classes;
    //       this.countryData = countries;
    //       this.restrictionData = restrictions;
    //       this.endorsementData = endorsments;

    //       this.loadLicenseData();
    //     },
    //     (error: HttpErrorResponse) => {
    //       this.shared.handleError(error);
    //     }
    //   );
  }

  openNote() {
    if (this.showNote === true) {
      this.showNote = false;
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  createForm() {
    this.licenseForm = this.formBuilder.group({
      licenseStartDate: ['', Validators.required],
      licenseEndDate: ['', Validators.required],
      state: [null, Validators.required],
      licenseNumber: ['', Validators.required],
      class: [null, Validators.required],
      country: [null, Validators.required],
      note: [''],
      restrictions: [null],
      endorsements: [null],
    });
    setTimeout(() => {
      this.transformInputData();
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  loadLicenseData() {
    this.driver = this.inputData.data.driver ? this.inputData.data.driver : null;
    if (this.driver && (this.driver?.doc?.licenseData || this.driver?.licenseData)) {
      this.licenseData = this.driver?.doc?.licenseData || this.driver?.licenseData;

      if (this.inputData.data.type === 'edit') {
        const license = this.licenseData
          ? this.licenseData.find((l) => l.id === this.inputData.data.id)
          : null;
        this.attachments = license.attachments;
        if (license && license.country && license.country.value) {
          this.metadataService
            .getJSON(license.country.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe((states: MetaData[]) => {
              this.stateData = states;
              this.setLicenceData(license);
            });
        } else {
          this.setLicenceData(license);
        }
      } else {
        this.setLicenceData(null);
      }
    } else {
      this.setLicenceData(null);
    }
  }

  setLicenceData(license: LicenseData) {
    this.loaded = true;
    this.license = license;
    if (license) {
      this.licenseForm.controls.licenseStartDate.setValue(new Date(license.startDate));
      this.licenseForm.controls.licenseEndDate.setValue(new Date(license.endDate));

      this.licenseForm.controls.licenseNumber.setValue(license.number);

      this.licenseForm.controls.class.setValue({
        id: license.class.id,
        value: license.class.value,
      });

      this.licenseForm.controls.country.setValue({
        id: license.country.id,
        value: license.country.value,
      });

      this.licenseForm.controls.state.setValue({
        key: license.state.key,
        value: license.state.value,
      });

      this.licenseForm.controls.restrictions.setValue(license.restrictions);
      this.licenseForm.controls.endorsements.setValue(license.endorsements);
      this.licenseForm.controls.note.setValue(
        license.note !== null ? license.note.replace(/<\/?[^>]+(>|$)/g, '') : ''
      );
      this.shared.touchFormFields(this.licenseForm);
    } else {
      this.licenseForm.controls.licenseStartDate.setValue('');
      this.licenseForm.controls.licenseEndDate.setValue('');
      this.licenseForm.controls.class.setValue(null);
      this.licenseForm.controls.country.setValue(null);
      this.licenseForm.controls.state.setValue(null);
      this.licenseForm.controls.restrictions.setValue(null);
      this.licenseForm.controls.endorsements.setValue(null);
    }

    if (!this.licenseForm.controls.country.value) {
      this.licenseForm.controls.state.disable();
    }
  }

  compareWith(a: any, b: any): boolean {
    return a && b && a.id === b.id;
  }

  editLicense(keepModal: boolean) {
    if (!this.shared.markInvalid(this.licenseForm)) {
      return false;
    }

    const license: LicenseData = {
      id: this.license ? this.license.id : uuidv4(),
      class: this.licenseForm.controls.class.value,
      country: this.licenseForm.controls.country.value,
      startDate: this.licenseForm.controls.licenseStartDate.value,
      endDate: this.licenseForm.controls.licenseEndDate.value,
      state: this.licenseForm.controls.state.value,
      note: this.licenseForm.controls.note.value,
      number: this.licenseForm.controls.licenseNumber.value,
      restrictions: this.licenseForm.controls.restrictions.value,
      endorsements: this.licenseForm.controls.endorsements.value,
      attachments: this.license && this.license.attachments ? this.license.attachments : [],
    };

    license.startDate = DateFormatter.formatDate(license.startDate.toString());
    license.endDate = DateFormatter.formatDate(license.endDate.toString());

    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    saveData.Owner = undefined;
    saveData.DriverUser = undefined;
    saveData.owner = undefined;
    saveData.driverUser = undefined;
    const index = this.licenseData.findIndex((l) => l.id === license.id);

    const tempData = this.licenseData;

    if (index !== -1) {
      tempData[index] = license;
    } else {
      tempData.push(license);
    }

    saveData.doc = {
      mvrData: this.driver.doc?.mvrData || this.driver?.mvrData,
      additionalData: this.driver.doc?.additionalData || this.driver?.additionalData,
      licenseData: tempData,
      workData: this.driver.doc?.workData || this.driver?.workData,
      testData: this.driver.doc?.testData || this.driver?.testData,
      medicalData: this.driver.doc?.medicalData || this.driver?.medicalData,
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
    //       'cdl',
    //       license.id.toString()
    //     )
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(
    //       (resp: any) => {
    //         resp.success.forEach((element) => {
    //           license.attachments.push(element);
    //         });
    //         this.notification.success(`Attachments successfully uploaded.`, ' ');
    //         this.driverService
    //           .updateDriverData(saveData, this.inputData.data.driver.id)
    //           .pipe(takeUntil(this.destroy$))
    //           .subscribe(
    //             (driver: DriverData) => {
    //               if (this.inputData.data.driver?.doc) {
    //                 this.inputData.data.driver.doc.licenseData =
    //                   driver.doc.licenseData || driver.licenseData;
    //               }
    //               this.shared.emitRefreshAfterUpdate.emit();
    //               if (this.inputData.data.type === 'edit') {
    //                 this.notification.success(
    //                   `License ${license.number} has been updated.`,
    //                   'Success:'
    //                 );
    //               } else {
    //                 this.notification.success(
    //                   `License ${license.number} has been added.`,
    //                   'Success:'
    //                 );
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
    //       (error: any) => {
    //         error ? this.shared.handleServerError() : null;
    //       }
    //     );
    // } else {
    //   this.driverService
    //     .updateDriverData(saveData, this.inputData.data.driver.id)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(
    //       (driver: DriverData) => {
    //         this.inputData.data.driver.doc.licenseData = driver.doc.licenseData;
    //         this.shared.emitRefreshAfterUpdate.emit();
    //         if (this.inputData.data.type === 'edit') {
    //           this.notification.success(`License ${license.number} has been updated.`, 'Success:');
    //         } else {
    //           this.notification.success(`License ${license.number} has been added.`, 'Success:');
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
    this.licenseForm.reset();
    this.licenseForm.controls.licenseNumber.setValue('');
    this.licenseForm.controls.licenseStartDate.setValue('');
    this.licenseForm.controls.licenseEndDate.setValue('');
    this.licenseForm.controls.class.setValue(null);
    this.licenseForm.controls.country.setValue(null);
    this.licenseForm.controls.state.setValue(null);
    this.closeModal();
  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.editLicense(false);
    }
  }

  getStatesLicense(country: any) {
    if (country && country.value) {
      this.metadataService
        .getJSON(country.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((states: MetaData[]) => {
          this.licenseForm.controls.state.reset();
          this.licenseForm.controls.state.enable();
          this.stateData = states;
        });
    } else {
      this.licenseForm.controls.state.reset();
      this.licenseForm.controls.state.disable();
    }
  }

  setFiles(files: any) {
    this.files = files;
  }

  onPaste(event: any, inputID: string, limitedCuracters?: number, index?: number) {
    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    }
    this.numOfSpaces = 0;

    event.preventDefault();
    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.fomratType,
      false,
      false,
      false,
      limitedCuracters
    );
    this.licenseForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onLicenseNumberTyping(event) {
    let k;
    k = event.charCode;
    console.log(k);
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }

    if (this.numOfSpaces < 2) {
      return (
        k == 8 ||
        k == 32 ||
        (k >= 65 && k <= 90) ||
        (k >= 97 && k <= 122) ||
        (k >= 48 && k <= 57) ||
        k == 45 ||
        k == 42
      );
    } else {
      event.preventDefault();
    }
  }

  selectRestriction(event: any) {
    console.log('selectRestriction event: ', event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private transformInputData() {
    const data = {
      licenseNumber: 'upper',
    };
    this.shared.handleInputValues(this.licenseForm, data);
  }
  public closeCDLModal() {
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
    this.licenseForm.get('driverDoc').setValue({
      id: uuidv4(),
      src: logoImage,
    });
  }
}
function uuidv4(): number {
    throw new Error('Function not implemented.');
}


