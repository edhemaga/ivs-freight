import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SharedService} from "../../../services/shared/shared.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {checkSelectedText, emailCheck, pasteCheck} from "../../../utils/methods.globals";
import {ManageContact} from "../../../model/contact";
import {NewLabel} from "../../../model/label";
import {ContactAccountService} from "../../../services/contact-account/contact-account.service";

@Component({
  selector: 'app-contact-manage',
  templateUrl: './contact-manage.component.html',
  styleUrls: ['./contact-manage.component.scss']
})
export class ContactManageComponent implements OnInit {

  @ViewChild('note') note: ElementRef;
  @Input() inputData: any;
  public contactForm: FormGroup;
  public loaded = false;
  public showNote = false;
  public textRows = 1;
  public contactData: ManageContact;
  public options = {
    componentRestrictions: {country: ['US', 'CA']},
  };
  public selected: any;
  public createdLabels: NewLabel[];
  public modalTitle: string;
  public formatType = /^[!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
  public numOfSpaces = 0;
  inputText: false;
  shareContactVisible: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private shared: SharedService,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private contactAccountService: ContactAccountService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getLabels();
    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'New contact';
      setTimeout(() => {
        this.loaded = true;
      });
    } else if (this.inputData.data.type === 'edit') {
      this.modalTitle = 'Edit contact';
      this.getDetails(this.inputData.data.id);
    }
  }

  /**
   * Create form function
   */
  public createForm() {
    this.contactForm = this.formBuilder.group({
      name: [null, Validators.required],
      phone: [null, [Validators.required, Validators.minLength(5)]],
      email: ['', Validators.email],
      address: [null, Validators.minLength(10)],
      labelId: [null],
      clientType: [''],
      note: [''],
      address_unit: [''],
    });
    setTimeout(() => {
      this.transformInputData();
    });
  }

  /**
   * Close address edit modal function
   */
  public closeAddressEditModal() {
    this.activeModal.close();
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
   * Get details function
   *
   * @param id Number
   */
  public getDetails(id: number) {
    return this.contactAccountService.getItemDetails('contact', id).subscribe(
      (response: ManageContact) => {
        this.contactData = response;
        this.selected = this.contactData.labelId;
        this.setForm(response);
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
  public setForm(data: ManageContact) {
    this.contactForm.setValue({
      name: data.name,
      phone: data.doc.phone,
      email: data.doc.email,
      address: data.doc.address,
      labelId: data.labelId || '',
      clientType: data.contactType,
      note: (data.doc.note !== null) ? (data.doc.note.replace(/<\/?[^>]+(>|$)/g, '')) : '',
      address_unit: data.doc.address_unit,
    });
    this.shared.touchFormFields(this.contactForm);
  }

  /**
   * Get labels function
   */
  public getLabels() {
    this.contactAccountService.getContactLabels().subscribe(
      (res: NewLabel[]) => {
        this.createdLabels = res;
      },
      (error: any) => {
        error ? this.shared.handleServerError() : null;
      }
    );
  }

  /**
   * Manage contacts function
   */
  public manageContact() {
    this.contactAccountService.reloadContact = true;
    const contactData = this.contactForm.getRawValue();
    this.contactForm.get('clientType').setValue('both');
    if (this.contactForm.get('address_unit').value === '') {
      this.contactForm.get('address_unit').setValue(null);
    }
    if (!this.shared.markInvalid(this.contactForm)) {
      return false;
    }
    const updatedContact = this.contactForm.value;
    const updatedContactJson = JSON.stringify(updatedContact);

    const manageData = this.contactForm.getRawValue();
    const manageContactData: ManageContact = {
      name: manageData.name,
      contactType: manageData.clientType,
      labelId: manageData.labelId || 0,
      doc: {
        phone: manageData.phone,
        email: manageData.email,
        address: manageData.address,
        address_unit: manageData.address_unit ? manageData.address_unit : '',
        note: manageData.note,
      },
    };
    if (this.inputData.data.type === 'new') {
      this.contactAccountService.createItem('contact', manageContactData).subscribe(
        (response: any) => {
          const customResponse = {
            resp: response,
            type: 'add-contact'
          };
          this.notification.success('Contact added successfully.', 'Success:');
          this.closeAddressEditModal();
          this.contactForm.reset();
          this.spinner.show(false);
          this.contactAccountService.emitContactsUpdate.emit(customResponse);
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
    } else if (this.inputData.data.type === 'edit') {
      this.contactAccountService
        .updateItem('contact', this.inputData.data.id, manageContactData)
        .subscribe(
          (response: any) => {
            this.closeAddressEditModal();
            this.notification.success(`Contact ${contactData.name} updated.`, 'Success:');
            const customResponse = {
              resp: response,
              oldLabel: this.inputData.data.id.labelId
            };
            this.contactAccountService.emitContactsUpdate.emit(customResponse);
            this.spinner.show(false);
          },
          (error: any) => {
            error ? this.shared.handleServerError() : null;
          }
        );
    }
  }

  /**
   * Handle address change function
   *
   * @param address Any
   */
  public handleAddressChange(address: any) {
    this.contactForm.get('address').setValue(address.formatted_address);
  }

  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, limitCarakters?: number, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(inputID, index);
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(inputID, index);
    }

    this.numOfSpaces = 0;

    if (inputID === 'email') {
      this.formatType = /^[!#$%^&*`()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
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

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  onEmailTyping(event) {
    return emailCheck(event);
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  private transformInputData() {
    const data = {
      name: 'nameInput',
      email: 'lower',
      address_unit: 'upper',
    };

    this.shared.handleInputValues(this.contactForm, data);
  }

  clearInput(x) {
    this.contactForm.controls[x.currentTarget.offsetParent.firstChild.id].reset();
  }

  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.contactForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }

  checkShareContact() {
    this.shareContactVisible = !this.shareContactVisible;
  }

}
