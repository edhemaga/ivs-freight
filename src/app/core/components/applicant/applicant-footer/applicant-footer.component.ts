import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
  convertDateFromBackend,
  convertDateFromBackendToTime,
} from './../../../utils/methods.calculations';

import moment from 'moment';

import { ApplicantActionsService } from './../state/services/applicant-actions.service';

import { ApplicantQuery } from '../state/store/applicant.query';

import { SelectedMode } from '../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../state/enum/input-switch-actions.enum';
import { IdNameList } from '../state/model/lists.model';
import {
  ApplicantCompanyInfoResponse,
  ApplicantResponse,
} from 'appcoretruckassist';

@Component({
  selector: 'app-applicant-footer',
  templateUrl: './applicant-footer.component.html',
  styleUrls: ['./applicant-footer.component.scss'],
})
export class ApplicantFooterComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('requestsBox')
  requestsBox: ElementRef;

  @ViewChild('documentsBox')
  documentsBox: ElementRef;

  @Input() mode: string;
  @Input() companyInfoSph: ApplicantCompanyInfoResponse;
  @Input() dateOfApplicationSph: string;

  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public sphTabForm: FormGroup;

  public dateOfApplication: string;
  public copyrightYear: string;

  public companyInfo: ApplicantCompanyInfoResponse;

  public displayInfoBox: boolean = false;
  public displayDocumentsBox: boolean = false;
  public displayRequestsBox: boolean = false;

  public selectedDocumentsTab: number = 1;
  public selectedRequestsTab: number = 1;
  public selectedSphReceivedBy: IdNameList;
  public selectedEmployer: IdNameList;

  public isDocumentsCardOpen: boolean = true;
  public hasMultiplePreviousEmployers: boolean = false;

  public documents: any[] = [];

  public requestsBoxObserver: any;
  public documentsBoxObserver: any;
  public requestsBoxHeight: number;
  public documentsBoxHeight: number;

  public documentsBoxTabs: IdNameList[] = [
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

  public requestsBoxTabs: IdNameList[] = [
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

  public sphReceivedByList: IdNameList[] = [
    { id: 1, name: 'Fax' },
    { id: 2, name: 'Mail' },
    { id: 3, name: 'E-Mail' },
    { id: 4, name: 'Telephone' },
    { id: 5, name: 'Other' },
  ];

  public previousEmployersList: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private router: Router,
    private applicantQuery: ApplicantQuery,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.copyrightYear = moment().format('YYYY');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode?.previousValue !== changes.mode?.currentValue) {
      this.selectedMode = changes.mode?.currentValue;
    }

    if (this.selectedMode !== SelectedMode.REVIEW) {
      this.getCompanyInfo();
    }

    if (this.selectedMode === SelectedMode.REVIEW) {
      this.createForm();

      this.getRequestsBoxHeight();
      this.getDocumentsBoxHeight();

      this.getRequestsBoxValuesFromStore();
    }

    if (
      changes.companyInfoSph?.previousValue !==
      changes.companyInfoSph?.currentValue
    ) {
      this.companyInfo = changes.companyInfoSph?.currentValue;
    }

    if (
      changes.dateOfApplicationSph?.previousValue !==
      changes.dateOfApplicationSph?.currentValue
    ) {
      this.dateOfApplication = changes.dateOfApplicationSph?.currentValue;
    }
  }

  public get previousRequests(): FormArray {
    return this.sphTabForm.get('requests') as FormArray;
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm() {
    this.sphTabForm = this.formBuilder.group({
      previousEmployer: null,
      applicantName: null,

      requests: this.formBuilder.array([]),

      dateReceivedRequest: [null],
      receivedByRequest: [null],
    });
  }

  public getRequestsBoxValuesFromStore() {
    let requestsBoxResponse: any;

    this.applicantQuery.applicant$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ApplicantResponse) => {
        requestsBoxResponse = res.requests;
      });

    this.patchRequestsBoxValues(requestsBoxResponse);
  }

  public patchRequestsBoxValues(requestsBoxValues: any) {
    requestsBoxValues = requestsBoxValues.map((item) => {
      return {
        id: item.workExperienceItemId,
        name: item.employerName,
        applicantName: item.applicantName,
        requests: item.requests,
      };
    });

    const firstItemInRequestsBoxValues = requestsBoxValues[0];

    if (requestsBoxValues.length > 1) {
      this.hasMultiplePreviousEmployers = true;

      this.previousEmployersList = requestsBoxValues;
    } else {
      this.hasMultiplePreviousEmployers = false;
    }

    this.selectedEmployer = firstItemInRequestsBoxValues;

    this.sphTabForm.patchValue({
      previousEmployer: firstItemInRequestsBoxValues?.name,
      applicantName: firstItemInRequestsBoxValues?.applicantName,
    });

    this.updateRequests(firstItemInRequestsBoxValues);
  }

  public handleInputSelect(event: any, type: string): void {
    switch (type) {
      case InputSwitchActions.PREVIOUS_EMPLOYER:
        this.selectedEmployer = event;

        this.updateRequests(this.selectedEmployer);

        break;
      case InputSwitchActions.SPH_RECEIVED_BY:
        this.selectedSphReceivedBy = event;

        break;

      default:
        break;
    }
  }

  private createNewRequest(): FormGroup {
    return this.formBuilder.group({
      dateOfRequest: [null],
      timeOfRequest: [null],
    });
  }

  public onCreateNewRequest(): void {
    const workExperienceItemId = this.selectedEmployer.id;

    this.applicantActionsService
      .invitePreviousEmployerSphForm({ workExperienceItemId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const inviteDate = convertDateFromBackend(res.inviteDate);

          const inviteTime = convertDateFromBackendToTime(res.inviteDate);

          this.previousRequests.push(this.createNewRequest());

          this.previousRequests
            .at(this.previousRequests.length - 1)
            .patchValue({
              dateOfRequest: inviteDate,
              timeOfRequest: inviteTime,
            });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public updateRequests(selectedEmployerRequests: any) {
    this.previousRequests.clear();

    const selectedRequestsLength = selectedEmployerRequests?.requests?.length
      ? selectedEmployerRequests.requests.length
      : null;

    setTimeout(() => {
      if (selectedRequestsLength) {
        for (let i = 0; i < selectedRequestsLength; i++) {
          const inviteDate = convertDateFromBackend(
            selectedEmployerRequests.requests[i].inviteDate
          );

          const inviteTime = convertDateFromBackendToTime(
            selectedEmployerRequests.requests[i].inviteDate
          );

          this.previousRequests.push(this.createNewRequest());

          this.previousRequests
            .at(this.previousRequests.length - 1)
            .patchValue({
              dateOfRequest: inviteDate,
              timeOfRequest: inviteTime,
            });
        }
      }
    }, 100);
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

  public onSphReceivedCardAction(event: { check: boolean; action: string }) {
    if (event.action === 'Open SPH') {
      this.router.navigate([`/sph-form`]);
    }

    if (event.action === 'download') {
    }
  }

  public getRequestsBoxHeight(): void {
    this.requestsBoxObserver = new ResizeObserver((entries) => {
      this.zone.run(() => {
        this.requestsBoxHeight = entries[0].contentRect.height;
      });
    });

    setTimeout(() => {
      this.requestsBoxObserver.observe(this.requestsBox.nativeElement);
    }, 1);
  }

  public getDocumentsBoxHeight(): void {
    this.documentsBoxObserver = new ResizeObserver((entries) => {
      this.zone.run(() => {
        this.documentsBoxHeight = entries[0].contentRect.height;
      });
    });

    setTimeout(() => {
      this.documentsBoxObserver.observe(this.documentsBox.nativeElement);
    }, 1);
  }

  public getCompanyInfo(): void {
    this.applicantQuery.applicant$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ApplicantResponse) => {
        this.companyInfo = res?.companyInfo;

        this.dateOfApplication = convertDateFromBackend(
          res?.inviteDate
        ).replace(/-/g, '/');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.selectedMode === SelectedMode.REVIEW) {
      this.requestsBoxObserver.unobserve(this.requestsBox.nativeElement);
      this.documentsBoxObserver.unobserve(this.documentsBox.nativeElement);
    }
  }
}
