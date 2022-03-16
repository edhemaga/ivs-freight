import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-settings-basic-modal',
  templateUrl: './settings-basic-modal.component.html',
  styleUrls: ['./settings-basic-modal.component.scss'],
})
export class SettingsBasicModalComponent implements OnInit {
  public modalTitle: string = 'Company';
  public selectedTab: number = 1;
  public tabs: {}[] = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Additional',
    },
    {
      id: 3,
      name: 'Payroll',
    },
  ];

  public loadedModal: boolean = true;
 
  public companyForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.companyForm = this.formBuilder.group({
      companyName: [null],
      usdot: [null],
      ein: [null],
      mc: [null],
      phone: [null],
      email: [null, Validators.email],
      fax: [null],
      webUrl: [null],
      address: [null, Validators.required],
      addressUnit: [null],
      irp: [null],
      ifta: [null],
      toll: [null],
      scac: [null],
      timeZone: [null],
      currency: [null]
    });
  }

  public tabChange(event: any) {
    this.selectedTab = event.id;
  }

  public saveCompany() {}

  public closeCompanyEdit() {
    this.activeModal.close();
  }

  public manageInputValidation(formElement: any) {
    return this.sharedService.manageInputValidation(formElement);
  }

  public keyPress(event: any) {
    return (event.charCode >= 64 && event.charCode <= 91) || (event.charCode >= 96 && event.charCode <= 123)
  }

  public clearInput(formControl: string) {
    this.companyForm.get(formControl).setValue(null);
  }

  public handleAddressChange(address: any) {
    this.sharedService.selectAddress(this.companyForm, address);
  }

  

  



















  public formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
  public numOfSpaces = 0;
  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, index?: number) {
    if (index !== undefined) {
      (<HTMLInputElement>document.getElementById(inputID + index)).value =
        checkSelectedText(inputID, index);
    } else {
      (<HTMLInputElement>document.getElementById(inputID)).value =
        checkSelectedText(inputID, index);
    }

    this.numOfSpaces = 0;

    event.preventDefault();
    if (inputID === 'companyName') {
      this.formatType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else if (inputID === 'email') {
      this.formatType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else {
      (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    }

    this.companyForm.controls[inputID].patchValue(
      (<HTMLInputElement>document.getElementById(inputID)).value
    );
  }
}
