import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SphModalComponent } from './sph-modal/sph-modal.component';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ModalService } from '../../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-sph',
  templateUrl: './sph.component.html',
  styleUrls: ['./sph.component.scss'],
})
export class SphComponent implements OnInit {
  public selectedMode: string = SelectedMode.FEEDBACK;

  public sphForm: FormGroup;

  public signature: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.sphForm = this.formBuilder.group({
      isTested: [false],
      hasReadAndUnderstood: [false],
    });
  }

  public handleCheckboxParagraphClick(type: string): void {
    if (this.selectedMode === 'FEEDBACK_MODE') {
      return;
    }

    switch (type) {
      case InputSwitchActions.IS_TESTED:
        this.sphForm.patchValue({
          isTested: !this.sphForm.get('isTested').value,
        });

        break;
      default:
        break;
    }
  }

  public onSignatureAction(event: any): void {
    this.signature = event;
  }

  public handleReviewSectionsClick(): void {
    this.modalService.openModal(
      SphModalComponent,
      {
        size: 'sph-applicant',
      },
      null,
      'sph-applicant-backdrop'
    );
  }
}
