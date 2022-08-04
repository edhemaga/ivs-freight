import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import moment from 'moment';

import { SelectedMode } from '../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../state/enum/input-switch-actions.enum';
import { CompanyInfoModel } from '../state/model/company.model';
import { SphReceivedBy } from '../state/model/sph-received-by.model';

import { ApplicantActionsService } from './../state/services/applicant-actions.service';
import { convertDateFromBackend } from './../../../utils/methods.calculations';

@Component({
  selector: 'app-applicant-footer',
  templateUrl: './applicant-footer.component.html',
  styleUrls: ['./applicant-footer.component.scss'],
})
export class ApplicantFooterComponent implements OnInit, OnDestroy {
  @ViewChild('requestsBox')
  requestsBox: ElementRef;

  @ViewChild('documentsBox')
  documentsBox: ElementRef;

  public selectedMode: string = SelectedMode.REVIEW;

  public sphTabForm: FormGroup;

  public copyrightYear: string;

  public companyInfo: CompanyInfoModel;

  public displayInfoBox: boolean = false;
  public displayDocumentsBox: boolean = false;
  public displayRequestsBox: boolean = false;

  public selectedDocumentsTab: number = 1;
  public selectedRequestsTab: number = 1;
  public selectedSphReceivedBy: { id: number; name: string };

  public isDocumentsCardOpen: boolean = true;

  public documentsBoxTabs: { id: number; name: string }[] = [
    {
      id: 1,
      name: 'CDL',
    },
    {
      id: 2,
      name: 'SSN',
    },
    {
      id: 3,
      name: 'Medical',
    },
    {
      id: 4,
      name: 'MVR',
    },
  ];

  public requestsBoxTabs: { id: number; name: string }[] = [
    {
      id: 1,
      name: 'SPH',
    },
    {
      id: 2,
      name: 'Medical',
    },
    {
      id: 3,
      name: 'Drug & Alcohol',
    },
  ];

  public sphReceivedByList: SphReceivedBy[] = [
    { id: 1, name: 'Fax' },
    { id: 2, name: 'Mail' },
    { id: 3, name: 'E-Mail' },
    { id: 4, name: 'Telephone' },
    { id: 5, name: 'Other' },
  ];

  public documents: any[] = [];

  public requestsBoxHeight: number;
  public documentsBoxHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    if (this.selectedMode === 'REVIEW_MODE') {
      this.createForm();
    }

    this.copyrightYear = moment().format('YYYY');

    this.getCompanyInfo();

    this.getRequestsBoxHeight();
    this.getDocumentsBoxHeight();
  }

  public get previousRequests(): FormArray {
    return this.sphTabForm.get('requests') as FormArray;
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm() {
    this.sphTabForm = this.formBuilder.group({
      previousEmployer: ['Dogma Brewery Logistic'],
      applicantName: ['Aleksandar Djordjevic'],

      requests: this.formBuilder.array([]),

      dateReceivedRequest: [null],
      receivedByRequest: [null],
    });
  }

  public handleInputSelect(event: any): void {
    this.selectedSphReceivedBy = event;
  }

  private createNewRequest(): FormGroup {
    return this.formBuilder.group({
      dateOfRequest: [null],
      timeOfRequest: [null],
    });
  }

  public onCreateNewRequest(): void {
    const currentDate = moment().format('L');
    const currentTime = moment().format('LT');

    this.previousRequests.push(this.createNewRequest());

    this.previousRequests.controls[
      this.previousRequests.controls.length - 1
    ].patchValue({
      dateOfRequest: [currentDate ? convertDateFromBackend(currentDate) : null],
      timeOfRequest: [currentDate, currentTime],
    });
  }

  public onHidePopupBox(type: string): void {
    switch (type) {
      case InputSwitchActions.INFO_BOX:
        this.displayInfoBox = false;

        break;
      case InputSwitchActions.DOCUMENTS_BOX:
        this.displayDocumentsBox = false;

        break;
      case InputSwitchActions.REQUESTS_BOX:
        this.displayRequestsBox = false;

        break;
      default:
        break;
    }
  }

  public onDisplayOrHidePopupBox(type: string): void {
    switch (type) {
      case InputSwitchActions.INFO_BOX:
        this.displayInfoBox = !this.displayInfoBox;

        break;
      case InputSwitchActions.DOCUMENTS_BOX:
        if (this.displayRequestsBox) {
          this.displayRequestsBox = false;
        }

        this.displayDocumentsBox = !this.displayDocumentsBox;

        break;
      case InputSwitchActions.REQUESTS_BOX:
        if (this.displayDocumentsBox) {
          this.displayDocumentsBox = false;
        }

        this.displayRequestsBox = !this.displayRequestsBox;

        break;
      default:
        break;
    }
  }

  public onOpenCloseCard(event: any): void {
    if (event) {
      this.isDocumentsCardOpen = true;
    } else {
      this.isDocumentsCardOpen = false;
    }
  }

  public onTabChange(event: any, type: string): void {
    switch (type) {
      case InputSwitchActions.DOCUMENTS_BOX:
        this.selectedDocumentsTab = event.id;

        break;
      case InputSwitchActions.REQUESTS_BOX:
        this.selectedRequestsTab = event.id;

        if (this.selectedRequestsTab === 1) {
          this.isDocumentsCardOpen = true;
        }

        break;
      default:
        break;
    }
  }

  public onFilesAction(event: any): void {
    this.documents = event.files;
  }

  public getRequestsBoxHeight(): void {
    const observer = new ResizeObserver((entries) => {
      this.zone.run(() => {
        this.requestsBoxHeight = entries[0].contentRect.height;
      });
    });

    setTimeout(() => {
      observer.observe(this.requestsBox.nativeElement);
    }, 1);
  }

  public getDocumentsBoxHeight(): void {
    const observer = new ResizeObserver((entries) => {
      this.zone.run(() => {
        this.documentsBoxHeight = entries[0].contentRect.height;
      });
    });

    setTimeout(() => {
      observer.observe(this.documentsBox.nativeElement);
    }, 1);
  }

  public getCompanyInfo(): void {
    this.applicantActionsService.getApplicantInfo$
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.companyInfo = data.companyInfo;
      });
  }

  public onAction(event: { check: boolean; action: string }) {
    // TODO: Implement your logic for download documents
  }

  ngOnDestroy(): void {}
}
