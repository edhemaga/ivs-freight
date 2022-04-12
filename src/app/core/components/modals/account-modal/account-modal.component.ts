import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from './../../../services/shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss'],
})
export class AccountModalComponent implements OnInit {
  public accountForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
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
      url: [
        null,
        [
          Validators.minLength(5),
          Validators.required,
          Validators.maxLength(400),
        ],
      ],
      companyAccountLabel: [null],
      note: [null],
    });
  }

  public onModalAction(action: string) {
    console.log(action)
    if (action === 'close') {
      this.accountForm.reset();
    } else {
      if (this.accountForm.invalid) {
        this.sharedService.markInvalid(this.accountForm);
        return;
      }
      console.log(this.accountForm.value);
      this.ngbActiveModal.close();
    }
  }
}
