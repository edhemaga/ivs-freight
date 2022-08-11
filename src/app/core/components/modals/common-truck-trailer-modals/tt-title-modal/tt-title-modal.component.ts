import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-tt-title-modal',
  templateUrl: './tt-title-modal.component.html',
  styleUrls: ['./tt-title-modal.component.scss'],
})
export class TtTitleModalComponent implements OnInit {
  @Input() editData: any;

  public ttTitleForm: FormGroup;

  public documents: any[] = [];

  public stateTypes: any[] = [];
  public selectedStateType: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData.type === 'edit-title') {
      this.editTitleById();
    }
  }

  private createForm() {
    this.ttTitleForm = this.formBuilder.group({
      titleNo: [null, Validators.required],
      stateId: [null, Validators.required],
      purchaseDate: [null, Validators.required],
      issueDate: [null, Validators.required],
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.ttTitleForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.ttTitleForm.invalid) {
          this.inputService.markInvalid(this.ttTitleForm);
          return;
        }
        if (this.editData.type === 'edit-inspection') {
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

  private addTitle() {}

  private updateTitle() {}

  private editTitleById() {}
}
