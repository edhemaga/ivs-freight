import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountModalComponent implements OnInit {
  public accountForm: FormGroup;
  public labels: any[] = [
    { id: 1, name: 'Aleksandar Djordjevic' },
    { id: 2, name: 'Denis Rodman' },
    { id: 3, name: 'James Halpert' },
    { id: 4, name: 'Pamela Beasley' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.accountForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(23)]],
      username: [null, [Validators.required, Validators.maxLength(40)]],
      password: [null, [Validators.required, Validators.maxLength(20)]],
      url: [null, [Validators.required, Validators.maxLength(400)]],
      companyAccountLabel: [null, [Validators.required]],
      note: [null],
    });
  }

  public onModalAction(action: string) {
    if (action === 'close') {
      this.accountForm.reset();
    } else {
      if (this.accountForm.invalid) {
        console.log(this.accountForm.value);
        this.inputService.markInvalid(this.accountForm);
        return;
      }
      this.ngbActiveModal.close();
    }
  }
}
