import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import {
  CreateTitleCommand,
  TitleModalResponse,
  TitleResponse,
  UpdateTitleCommand,
} from 'appcoretruckassist';

import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../services/notification/notification.service';
import {
  convertDateToBackend,
  convertDateFromBackend,
} from '../../../../utils/methods.calculations';

@Component({
  selector: 'app-tt-title-modal',
  templateUrl: './tt-title-modal.component.html',
  styleUrls: ['./tt-title-modal.component.scss'],
})
export class TtTitleModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public ttTitleForm: FormGroup;

  public documents: any[] = [];

  public stateTypes: any[] = [];
  public selectedStateType: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private commonTruckTrailerService: CommonTruckTrailerService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getModalDropdowns();

    if (this.editData.type === 'edit-title') {
      this.editTitleById(this.editData.file_id);
    }
  }

  private createForm() {
    this.ttTitleForm = this.formBuilder.group({
      number: [null, Validators.required],
      stateId: [null, Validators.required],
      purchaseDate: [null, Validators.required],
      issueDate: [null, Validators.required],
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.ttTitleForm.invalid) {
          this.inputService.markInvalid(this.ttTitleForm);
          return;
        }
        if (this.editData.type === 'edit-title') {
          this.updateTitle();
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addTitle();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      default: {
      }
    }
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'state': {
        this.selectedStateType = event;
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

  private addTitle() {
    const { issueDate, purchaseDate, ...form } = this.ttTitleForm.value;
    const newData: CreateTitleCommand = {
      ...form,
      issueDate: convertDateToBackend(issueDate),
      purchaseDate: convertDateToBackend(purchaseDate),
      stateId: this.selectedStateType ? this.selectedStateType.id : null,
      trailerId: this.editData.modal === 'trailer' ? this.editData.id : null,
      truckId: this.editData.modal === 'truck' ? this.editData.id : null,
    };

    this.commonTruckTrailerService
      .addTitle(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly added new title!',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error("Can't add new title!", 'Error');
        },
      });
  }

  private updateTitle() {
    const { issueDate, purchaseDate, ...form } = this.ttTitleForm.value;
    const newData: UpdateTitleCommand = {
      id: this.editData.file_id,
      ...form,
      issueDate: convertDateToBackend(issueDate),
      purchaseDate: convertDateToBackend(purchaseDate),
      stateId: this.selectedStateType ? this.selectedStateType.id : null,
    };

    this.commonTruckTrailerService
      .updateTitle(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Title successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Title can't be updated.", 'Error:');
        },
      });
  }

  private editTitleById(id: number) {
    this.commonTruckTrailerService
      .getTitleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TitleResponse) => {
          this.ttTitleForm.patchValue({
            number: res.number,
            stateId: res.state ? res.state.stateShortName : null,
            purchaseDate: res.purchaseDate
              ? convertDateFromBackend(res.purchaseDate)
              : null,
            issueDate: res.issueDate
              ? convertDateFromBackend(res.issueDate)
              : null,
            note: res.note,
          });
          this.selectedStateType = res.state;
        },
        error: () => {
          this.notificationService.error("Title can't be load.", 'Error:');
        },
      });
  }

  private getModalDropdowns() {
    this.commonTruckTrailerService
      .getTitleModalDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TitleModalResponse) => {
          this.stateTypes = res.states.map((item) => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName,
            };
          });
        },
        error: () => {
          this.notificationService.error(
            "Can't load title modal dropdowns!",
            'Error'
          );
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
