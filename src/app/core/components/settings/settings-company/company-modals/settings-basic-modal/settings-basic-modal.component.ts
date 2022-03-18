import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { checkSelectedText, emailChack, pasteCheck } from 'src/assets/utils/methods-global';

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

  public companyForm: FormGroup;

  public timeZones = [
    {
      id: 1,
      name: '(UTC-10) Hawaii Standard Time',
      offset: -10
    },
    {
      id: 2,
      name: '(UTC-9) Alaska Standard Time',
      offset: -9
    },
    {
      id: 3,
      name: '(UTC-8) Pacific Standard Time',
      offset: -8
    },
    {
      id: 4,
      name: '(UTC-7) Mountain Standard Time',
      offset: -7
    },
    {
      id: 5,
      name: '(UTC-6) Central Standard Time',
      offset: -6
    },
    {
      id: 6,
      name: '(UTC-5) Eastern Standard Time',
      offset: -5
    }
  ];
  public currencies = [
    {
      id: 1,
      code: 'usd',
      symbol: '$',
      name: 'US Dollar ($)',
    },
    {
      id: 1,
      code: 'cad',
      symbol: 'C$',
      name: 'CA Dollar (C$)',
    },
  ];

  // export const PAY_PERIODS = [
  //   {
  //     id: 'weekly',
  //     name: 'Weekly',
  //   },
  //   {
  //     id: 'bi-weekly',
  //     name: 'Bi-weekly',
  //   },
  //   {
  //     id: 'semi-monthly',
  //     name: 'Semi Monthly'
  //   },
  //   {
  //     id: 'monthly',
  //     name: 'Monthly',
  //   },
  // ];

  // export const DAYS = [
  //   {
  //     id: 'monday',
  //     name: 'Monday',
  //   },
  //   {
  //     id: 'tuesday',
  //     name: 'Tuesday',
  //   },
  //   {
  //     id: 'wednesday',
  //     name: 'Wednesday',
  //   },
  //   {
  //     id: 'thursday',
  //     name: 'Thursday',
  //   },
  //   {
  //     id: 'friday',
  //     name: 'Friday',
  //   },
  //   {
  //     id: 'saturday',
  //     name: 'Saturday',
  //   },
  //   {
  //     id: 'sunday',
  //     name: 'Sunday',
  //   },
  // ];
  
  public logoUrl = 'assets/img/logo-placeholder.svg';
  public showUploadZone = false;
  public editLogoActive = false;

  public formatType = /^[!^()_\\[\]{};':"\\|<>\/?]*$/; // default format Type
  public numberOfSpaces = 0;

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
      name: [null],
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
      currency: [null],
    });
  }

  public tabChange(event: any) {
    this.selectedTab = event.id;
  }

  public saveCompany() {}

  public closeCompanyEdit() {
    this.activeModal.close();
  }

  public saveFormOnKeyboardEnter(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.saveCompany();
    } else if (event.keyCode === 8) {
      this.numberOfSpaces = 0;
    }
  }

  public clearInput(formControl: string) {
    this.companyForm.get(formControl).setValue(null);
  }


  public callCancel(event: any) {
    this.editLogoActive = false;
    this.showUploadZone = true;
  }

  editLogo(): void {
    this.editLogoActive = true;
    this.showUploadZone = false;
  }



  // INPUT VALIDATIONS METHODS  

  public manageInputValidation(formElement: any) {
    return this.sharedService.manageInputValidation(formElement);
  }

  public onEmailTyping(event) {
    return emailChack(event);
  }

  /**
   * @param keyboardEvent - on user typing;  .key (signs), .keyCode (number of signs)
   * @param elementId - get input reference
   */
  public keyPress(
    keyboardEvent: KeyboardEvent,
    elementId: string,
    typeOfInput: any
  ) {
    // Prevent User to start with below characters
    if ((document.getElementById(elementId) as HTMLInputElement).value === '') {
      if (
        keyboardEvent.key === '*' ||
        keyboardEvent.key === '=' ||
        keyboardEvent.key === '+' ||
        keyboardEvent.key === '#' ||
        keyboardEvent.key === '%' ||
        keyboardEvent.key === '?' ||
        keyboardEvent.key === '!' ||
        keyboardEvent.key === '&' ||
        keyboardEvent.key === ' '
      ) {
        keyboardEvent.preventDefault();
        return false;
      }
    }
    if (typeOfInput === 'text') {
      // Prevent User to make two spaces
      if (keyboardEvent.keyCode === 32 && this.numberOfSpaces === 0) {
        this.numberOfSpaces++;
      } else if (this.numberOfSpaces === 1 && keyboardEvent.keyCode === 32) {
        keyboardEvent.preventDefault();
        return false;
      } else if (keyboardEvent.keyCode !== 32) {
        this.numberOfSpaces = 0;
      }
    } else if (typeOfInput === 'number') {
      return keyboardEvent.keyCode >= 48 && keyboardEvent.keyCode <= 57;
    }
  }

  /**
   * @param keyboardEvent - on user event
   * @param inputID
   * @param limitCharacters - limit user input
   * @param index - if formArray or any[] index
   */
  onPaste(
    event: any,
    inputID: string,
    limitCharacters?: number,
    index?: number
  ) {
    // Check if input has index from array
    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value =
        checkSelectedText(inputID, index);
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value =
        checkSelectedText(inputID, index);
    }

    this.numberOfSpaces = 0;
    this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;

    if (['mc', 'usdot', 'ein'].includes(inputID)) {
      this.formatType = /^[!@#$%`^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false,
        false,
        false,
        limitCharacters
      );
    } else {
      (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true
      );
    }
  }
}
