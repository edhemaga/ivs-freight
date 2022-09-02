import {
  addressUnitValidation,
  addressValidation,
  emailRegex,
  emailValidation,
  firstNameValidation,
  lastNameValidation,
} from './../../shared/ta-input/ta-input.regex-validations';
import { phoneRegex } from '../../shared/ta-input/ta-input.regex-validations';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { TaUserService } from 'src/app/core/services/user/user.service';
import {
  AddressEntity,
  SignInResponse,
  UpdateUserCommand,
  UserResponse,
} from 'appcoretruckassist';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';

@Component({
  selector: 'app-profile-update-modal',
  templateUrl: './profile-update-modal.component.html',
  styleUrls: ['./profile-update-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
})
export class ProfileUpdateModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private user: SignInResponse = JSON.parse(localStorage.getItem('user'));

  public selectedTab: number = 1;

  public profileUserForm: FormGroup;

  public tabs: any[] = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Additional',
    },
  ];

  public croppieOptions: Croppie.CroppieOptions = {
    enableExif: true,
    viewport: {
      width: 194,
      height: 194,
      type: 'circle',
    },
    boundary: {
      width: 456,
      height: 194,
    },
  };

  public selectedAddress: AddressEntity = null;

  public correctPassword: boolean = false;
  public setNewPassword: boolean = false;
  public loadingOldPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private userService: TaUserService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private imageBase64Service: ImageBase64Service
  ) {}

  ngOnInit() {
    this.createForm();
    this.getUserById();
    this.changeCheckboxDetection();
  }

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector('.animation-two-tabs');

    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  private createForm() {
    this.profileUserForm = this.formBuilder.group({
      firstName: [null, [Validators.required, ...firstNameValidation]],
      lastName: [null, [Validators.required, ...lastNameValidation]],
      mobile: [null, phoneRegex],
      email: [null, [emailRegex, ...emailValidation]],
      address: [null, [...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      createNewPassword: [false],
      checkingOldPassword: [null],
      oldPassword: [null],
      newPassword: [null],
      password: [null],
      avatar: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    if (data.action === 'close') {
      this.profileUserForm.reset();
    }

    if (data.action === 'save') {
      this.updateUserProfile();
      this.modalService.setModalSpinner({ action: null, status: true });
    }
  }

  public changeCheckboxDetection() {
    this.profileUserForm
      .get('createNewPassword')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.profileUserForm.get('oldPassword')
          );
        } else {
          this.inputService.changeValidators(
            this.profileUserForm.get('newPassword'),
            false
          );
          this.inputService.changeValidators(
            this.profileUserForm.get('password'),
            false
          );
          this.inputService.changeValidators(
            this.profileUserForm.get('oldPassword'),
            false
          );
          this.setNewPassword = false;
          this.correctPassword = false;
          this.inputService.changeValidators(
            this.profileUserForm.get('checkingOldPassword'),
            false
          );
        }
      });

    this.confirmationOldPassword();
  }

  public confirmationOldPassword() {
    this.profileUserForm
      .get('oldPassword')
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.inputService.changeValidators(
          this.profileUserForm.get('checkingOldPassword')
        );
        if (value) {
          this.loadingOldPassword = true;
          this.userService
            .validateUserPassword({ password: value })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res: any) => {
                if (res.correctPassword) {
                  this.correctPassword = true;
                } else {
                  this.correctPassword = false;
                }
                this.loadingOldPassword = false;
              },
              error: () => {
                this.notificationService.error(
                  'Something went wrong, please try again !',
                  'Error'
                );
              },
            });
        }
      });

    this.passwordsNotSame();
  }

  private passwordsNotSame(): void {
    this.profileUserForm
      .get('password')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (
          value?.toLowerCase() ===
          this.profileUserForm.get('newPassword').value?.toLowerCase()
        ) {
          this.profileUserForm.get('password').setErrors(null);
        } else {
          this.profileUserForm.get('password').setErrors({
            invalid: true,
          });
        }
      });
  }

  public onSetNewPassword() {
    if (this.correctPassword) {
      this.setNewPassword = true;
      this.inputService.changeValidators(
        this.profileUserForm.get('checkingOldPassword'),
        false
      );
      this.inputService.changeValidators(
        this.profileUserForm.get('newPassword')
      );
      this.inputService.changeValidators(this.profileUserForm.get('password'));
    }
  }

  public onUploadImage(event: any) {
    this.profileUserForm.get('avatar').patchValue(event);
    this.profileUserForm.get('avatar').setErrors(null);
  }

  public onImageValidation(event: boolean) {
    if (!event) {
      this.profileUserForm.get('avatar').setErrors({ invalid: true });
    } else {
      this.inputService.changeValidators(
        this.profileUserForm.get('avatar'),
        false
      );
    }
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }): void {
    if (event.valid) {
      this.selectedAddress = event.address;
    }
  }

  private getUserById() {
    this.userService
      .getUserById(this.user.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: UserResponse) => {
          this.profileUserForm.patchValue({
            firstName: res.firstName,
            lastName: res.lastName,
            mobile: res.mobile,
            email: res.email,
            address: res.address.address,
            addressUnit: res.address.addressUnit,
            avatar: res.avatar,
          });

          this.selectedAddress = res.address;
        },
        error: () => {
          this.notificationService.error("Can't get user", 'Error');
        },
      });
  }

  private updateUserProfile() {
    const {
      address,
      addressUnit,
      createNewPassword,
      checkingOldPassword,
      oldPassword,
      newPassword,
      ...form
    } = this.profileUserForm.value;

    if (this.selectedAddress) {
      this.selectedAddress = {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      };
    }

    const newData: UpdateUserCommand = {
      id: this.user.userId,
      ...form,
      address: this.selectedAddress?.address ? this.selectedAddress : null,
    };

    this.userService
      .updateUser(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly update profile',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });

          const newUser = {
            ...this.user,
            firstName: this.profileUserForm.get('firstName').value,
            lastName: this.profileUserForm.get('lastName').value,
            avatar: this.profileUserForm.get('avatar').value,
          };
          this.userService.updateUserProfile(true);
          localStorage.setItem('user', JSON.stringify(newUser));
        },
        error: () => {
          this.notificationService.error("Can't update your profile.", 'Error');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
