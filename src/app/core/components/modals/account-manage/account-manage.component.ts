import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from 'src/app/core/services/notification/notification.service';
import {SharedService} from 'src/app/core/services/shared/shared.service';
import {SpinnerService} from 'src/app/core/services/spinner/spinner.service';
import {ManageAccount} from 'src/app/core/model/account';
import {NewLabel} from 'src/app/core/model/label';
import {ContactAccountService} from 'src/app/core/services/contact-account/contact-account.service';
import {checkSelectedText, emailChack, pasteCheck} from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: ['./account-manage.component.scss'],

})
export class AccountManageComponent implements OnInit {

  @ViewChild('note') note: ElementRef;
  @Input() inputData: any;
  public accountForm: FormGroup;
  public showNote = false;
  public loaded = false;
  public textRows = 1;
  public accountData: ManageAccount;
  public hidePassword = true;
  public createdLabels: NewLabel[];
  public selectedLabelId: any;
  public accountPass: any;
  public passwordStrength: any;
  public modalTitle: string;
  public formatType = /^[!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
  public numOfSpaces = 0;
  inputText: false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private shared: SharedService,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private contactAccountService: ContactAccountService,
    private accountService: ContactAccountService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getLabels();
    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'New account';
      setTimeout(() => {
        this.loaded = true;
      });
    } else if (this.inputData.data.type === 'edit') {
      this.getDetails(this.inputData.data.id);
      this.decryptPassword(this.inputData.data.id);
      this.modalTitle = 'Edit account';
    }
  }

  /**
   * Create form function
   */
  public createForm() {
    this.accountForm = this.formBuilder.group({
      name: [null, [Validators.minLength(5), Validators.required]],
      username: [null, Validators.required],
      password: [null],
      url: ['', [Validators.minLength(5)]],
      labelId: [''],
      note: [''],
    });
    setTimeout(() => {
      this.transformInputData();
    });
  }

  /**
   * Close accounts edit modal function
   */
  public closeAccountsEditModal() {
    this.activeModal.close();
  }

  /**
   * Get details function
   *
   * @param id Any
   */
  public getDetails(id: any) {
    return this.contactAccountService.getItemDetails('account', id).subscribe(
      (response: ManageAccount) => {
        this.accountData = response;
        this.selectedLabelId = this.accountData.labelId;
        this.setForm(this.accountData);
        this.loaded = true;
        if (response.doc.note.length > 1) {
          this.showNote = true;
        }
      },
      (error: any) => {
        error ? this.shared.handleServerError() : null;
      }
    );
  }

  /**
   * Set form function
   *
   * @param data Any
   */
  public setForm(data: ManageAccount) {
    this.accountForm.setValue({
      name: data.name,
      username: data.username,
      password: data.password,
      url: data.url,
      labelId: data.labelId || '',
      note: (data.doc.note !== null) ? (data.doc.note.replace(/<\/?[^>]+(>|$)/g, '')) : '',
    });
    this.shared.touchFormFields(this.accountForm);
  }

  /**
   * Manage account function
   */
  public manageAccount() {
    console.log(this.accountForm.value);
    this.accountService.reloadAccount = true;
    if (!this.shared.markInvalid(this.accountForm)) {
      return false;
    }
    const updatedAccount = this.accountForm.value;
    JSON.stringify(updatedAccount);
    const manageData = this.accountForm.getRawValue();
    const manageAccountData: ManageAccount = {
      name: manageData.name,
      username: manageData.username,
      url: manageData.url,
      password: manageData.password,
      labelId: manageData.labelId || 0,
      doc: {
        note: manageData.note,
      },
    };
    if (this.inputData.data.type === 'edit') {
      this.contactAccountService
        .updateItem('account', this.inputData.data.id, manageAccountData)
        .subscribe(
          (response: any) => {
            this.notification.success('Account changed successfully.', 'Success:');
            this.closeAccountsEditModal();
            const customResponse = {
              resp: response,
              oldLabel: this.inputData.data.id.labelId
            };
            this.contactAccountService.emitAccountsUpdate.emit(customResponse);
            this.spinner.show(false);
          },
          (error: any) => {
            error ? this.shared.handleServerError() : null;
          }
        );
    } else if (this.inputData.data.type === 'new') {
      this.contactAccountService.createItem('account', manageAccountData).subscribe(
        (response: any) => {
          const customResponse = {
            resp: response,
            type: 'add-account'
          };
          this.notification.success('Account added successfully.', 'Success:');
          this.closeAccountsEditModal();
          this.accountForm.reset();
          this.contactAccountService.emitAccountsUpdate.emit(customResponse);
          this.spinner.show(false);
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
    }
  }

  /**
   * Open note function
   */
  public openNote() {
    if (this.showNote === true) {
      this.showNote = false;
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  /**
   * Handle height function
   *
   * @param val String
   */
  public handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  /**
   * Get label function
   */
  public getLabels() {
    this.contactAccountService.getAccountLabels().subscribe(
      (res: NewLabel[]) => {
        this.createdLabels = res;


        console.log('Labels Accounts');
        console.log( this.createdLabels);
      },
      (error: any) => {
        error ? this.shared.handleServerError() : null;
      }
    );
  }

  /**
   * Decrypt password function
   *
   * @param id Any
   */
  public decryptPassword(id) {
    this.loaded = false;
    this.contactAccountService.decryptPassword(id).subscribe(
      (response: any) => {
        this.accountForm.get('password').setValue(response.password);
        this.loaded = true;
      },
      (error: any) => {
        error ? this.shared.handleServerError() : null;
      }
    );
  }

  /**
   * Random password function
   *
   * @param length Number
   */
  public randomPassword(length: number = 18) {
    const chars =
      '+_)(*&^%$#@!=-0987654321}{POIUYTREWQ|":LKIJUHGFDSA?><MNBVCXZ][poiuytrewq\';lkjhgfdsa/.,mnbvcxz';
    this.accountPass = '';
    for (let x = 0; x < length; x++) {
      const i = Math.floor(Math.random() * chars.length);
      this.accountPass += chars.charAt(i);
    }
    this.hidePassword = false;
    this.passwordStrength = 'excellent';
    return this.accountPass;
  }

  /**
   * On strength changed function
   *
   * @param strength Number
   */
  public onStrengthChanged(strength: number) {
    switch (strength) {
      case 20:
        this.passwordStrength = 'very weak';
        break;
      case 40:
        this.passwordStrength = 'weak';
        break;
      case 60:
        this.passwordStrength = 'good';
        break;
      case 80:
        this.passwordStrength = 'secure';
        break;
      case 100:
        this.passwordStrength = 'excellent';
        break;
    }
  }

  /**
   * Account pass change function
   *
   * @param event Any
   */
  public accountPassChange(event: any) {
    if (event === '') {
      this.passwordStrength = '';
    }
  }

  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, limitCarakters?: number, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    }

    this.numOfSpaces = 0;

    if (inputID === 'username') {
      this.formatType = /^[!#$%^&*`()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false,
        false,
        false,
        limitCarakters
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false,
        false,
        false,
        limitCarakters
      );
    }
    this.accountForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return (k > 64 && k < 91) || (k > 96 && k <= 122) || (k > 47 && k < 58) || k == 8 || k == 32 || k == 46 || k == 45;
    } else {
      event.preventDefault();
    }
  }

  onEmailTyping(event) {
    return emailChack(event);
  }

  private transformInputData() {
    const data = {
      name: 'nameInput',
      username: 'lower',
    };

    this.shared.handleInputValues(this.accountForm, data);
  }

  clearInput(x) {
    this.accountForm.controls[x.currentTarget.offsetParent.firstChild.id].reset();
  }

  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.accountForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }

  clearPasswordInput() {
    return;
  }
}
