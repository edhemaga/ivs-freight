import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {emailChack} from "../../../../../assets/utils/methods-global";
import {checkSelectedText, pasteCheck} from "../../../utils/methods.globals";
import {Address} from "../../../model/address";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {SharedService} from "../../../services/shared/shared.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {UserService} from "../../../services/user/user.service";
import * as AppConst from './../../../../const';

@Component({
  selector: 'app-company-user-manage',
  templateUrl: './company-user-manage.component.html',
  styleUrls: ['./company-user-manage.component.scss']
})
export class CompanyUserManageComponent implements OnInit {

  @Input() inputData: any;
  @ViewChild("addressInput") addressInput: ElementRef;
  public usersForm: FormGroup;
  public userTypes = AppConst.USER_TYPES;
  public passwordType = 'text';
  public options = {
    componentRestrictions: {country: ['US', 'CA']},
  };
  public modalTitle: string;
  isValidAddress = false;
  address: Address;
  public disableUserType = false;
  loading = false;
  public fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  private destroy$: Subject<void> = new Subject<void>();
  inputText: false;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private shared: SharedService
  ) {
  }

  ngOnInit() {
    this.createNewForm();

    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'New user';
    } else if (this.inputData.data.type === 'edit') {
      this.modalTitle = 'Edit user';
      console.log('Poziva se edit user');
      console.log(this.inputData);
      this.setForm();
    }

    setTimeout(() => {
      this.transformInputData();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.passwordType = 'password';
    }, 500);
  }

  /**
   * Create new form function
   */
  public createNewForm() {
    this.usersForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      phone: [''],
      address: this.address,
      addressUnit: '',
      userType: [undefined, Validators.required],
      enabled: [true],
    });
  }

  /**
   * Set form function
   */
  public setForm() {
    this.loading = true;

    const users$ = this.userService.getUserByUsername(this.inputData.data.user.email);
    forkJoin([users$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([users]: [any]) => {
          console.log('User to edit');
          console.log(users);

          this.loading = false;

          this.disableUserType =
            users.userType === 'company_owner' || users.baseUserType === 'company_owner' || users.baseUserType === 'master' || users.userType === 'master';

          this.usersForm.setValue({
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            phone: users?.phone ? users?.phone : '',
            address: users?.doc?.address ? users?.doc?.address?.address : '',
            addressUnit: users?.doc?.addressUnit ? users?.doc?.addressUnit : '',
            userType: users?.doc?.userType ? users?.doc?.userType : null,
            enabled: users?.status ? users?.status : 0,
          });

          if (Object.keys(users?.doc).length > 0 && users?.doc?.address?.address !== '') {
            this.address = users.doc.address;
            this.isValidAddress = true;
          }

          this.shared.touchFormFields(this.usersForm);
        },
        () => {
          this.shared.handleServerError();
          this.closeModal();
        }
      );
  }

  handleUserName(userFullName: string, isFirstName: boolean) {
    let count = 0;
    let newValue = '';
    if (isFirstName) {
      for (const nameCharacter of userFullName) {
        if (nameCharacter === ' ') {
          count++;
        }
        if (!count) {
          newValue += nameCharacter;
        }
      }
      return newValue;
    } else {
      for (const nameCharacter of userFullName) {
        if (count) {
          newValue += nameCharacter;
        }
        if (nameCharacter === ' ') {
          count++;
        }
      }
      return newValue;
    }
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.usersForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  /**
   * Key down function
   *
   * @param event Any
   */
  public keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.saveUser();
    }
  }

  /**
   * Close modal function
   */
  public closeModal() {
    this.activeModal.close();
  }

  /**
   * Save user function
   */
  public saveUser() {
    //this.userService.reloadUserTabel = true;
    if (!this.shared.markInvalid(this.usersForm)) {
      return false;
    }

    const user = this.usersForm.value;

    if (this.inputData.data.type === 'new') {
      const saveDataNew = {
        email: user.email,
        userType: user.userType.name.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
        doc: {
          address: this.address,
          addressUnit: user.addressUnit,
          userType: user.userType,
          phone: user.phone,
        },
      };

      this.userService
        .createUser(saveDataNew)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.usersForm.reset();
            this.notification.success('User added successfully.', 'Success:');
            this.spinner.show(false);
            this.userService.newUser.next(res);
            this.closeModal();
          },
          () => {
            this.shared.handleServerError();
          }
        );
    } else if (this.inputData.data.type === 'edit') {
      const saveDataEdit = {
        email: user.email,
        userType: user.userType.name.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
        doc: {
          address: this.address,
          addressUnit: user.addressUnit,
          userType: user.userType,
          phone: user.phone,
        },
      };

      this.userService
        .updateUser(this.inputData.data.user.id, saveDataEdit)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.usersForm.reset();
            this.notification.success('User changed successfully.', 'Success:');
            this.spinner.show(false);
            this.userService.editUser.next(res);
            this.closeModal();
          },
          () => {
            this.shared.handleServerError();
          }
        );
    }
  }

  onEmailTyping(event) {
    return emailChack(event);
  }

  onPaste(event: any, inputID: string, index?: number) {
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

    if (inputID === 'firstName') {
      this.fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    } else if (inputID === 'lastName') {
      this.fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    } else if (inputID === 'email') {
      this.fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    }

    this.usersForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32;
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private transformInputData() {
    const data = {
      firstName: 'capitalize',
      lastName: 'capitalize',
      email: 'lower',
      addressUnit: 'upper',
    };

    this.shared.handleInputValues(this.usersForm, data);
  }

  clearInput(x) {
    this.usersForm.controls[x.currentTarget.offsetParent.firstChild.id].reset();
  }

  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.usersForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }
}
