import { card_modal_animation } from './../../shared/animations/card-modal.animation';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MockModalService } from 'src/app/core/services/mockmodal.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
  animations: [card_modal_animation('showHideSharedContact', '20px')],
})
export class ContactModalComponent implements OnInit {
  @Input() editData: any;

  public contactForm: FormGroup;
  public contactLabels: any[] = [];
  public sharedLabels: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private mockModalService: MockModalService
  ) {}

  ngOnInit() {
    this.createForm();
    this.contactLabels = this.mockModalService.accountLabels;
    this.sharedLabels = this.mockModalService.sharedLabels;
  }

  private createForm() {
    this.contactForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(23)]],
      companyContactLabelId: [null],
      phone: [null, [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]],
      email: [
        null,
        [Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)],
      ],
      address: [null],
      addressUnit: [null, [Validators.maxLength(6)]],
      shared: [false],
      sharedLabelId: [null],
      note: [null],
    });
  }

  public onModalAction(action: string) {
    if (action === 'close') {
      this.contactForm.reset();
    } else {
      if (this.contactForm.invalid) {
        console.log(this.contactForm.value);
        this.inputService.markInvalid(this.contactForm);
        return;
      }
      this.ngbActiveModal.close();
    }
  }
  public openCloseCheckboxCard(event: any) {
    if(this.contactForm.get('shared').value) {
      event.preventDefault();
      event.stopPropagation();
      this.contactForm.get('shared').setValue(false);
    }
  }
}
