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
      accountname: [null, [Validators.required]],
      username: [null, Validators.required],
      password: [null, Validators.required],
      hyperlink: [null, [Validators.minLength(5), Validators.required]],
      labelId: [''],
      note: [''],
    });
  }

  public onModalAction(action: string) {
    console.log("ACCOUNT ", action)
  }
}
