import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss']
})
export class AccountModalComponent implements OnInit {

  public accountForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.accountForm = this.formBuilder.group({
      accountname: [null, [Validators.required, Validators.maxLength(23)]],
      username: [null, [Validators.required, Validators.maxLength(40)]],
      password: [null, [Validators.required, Validators.maxLength(20)]],
      hyperlink: [null, [Validators.minLength(5), Validators.required, Validators.maxLength(400)]],
      labelId: [''],
      note: [''],
    });
  }

  public onModalAction(action: string) {
    if(action === 'cancel') {
      this.accountForm.reset();
    }
    else {
      console.log(this.accountForm.value)
    }
  }
}
