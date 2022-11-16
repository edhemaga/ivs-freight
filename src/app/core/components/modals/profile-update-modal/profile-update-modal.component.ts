import {
   addressUnitValidation,
   addressValidation,
   firstNameValidation,
   lastNameValidation,
   passwordValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { phoneFaxRegex } from '../../shared/ta-input/ta-input.regex-validations';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import {
   AddressEntity,
   SignInResponse,
   UpdateUserCommand,
   UserResponse,
} from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { TaUserService } from '../../../services/user/user.service';
import Croppie from 'croppie';
import { FormService } from '../../../services/form/form.service';

@Component({
   selector: 'app-profile-update-modal',
   templateUrl: './profile-update-modal.component.html',
   styleUrls: ['./profile-update-modal.component.scss'],
   animations: [tab_modal_animation('animationTabsModal')],
   providers: [FormService, ModalService],
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
   public userPasswordTyping: boolean = false;
   public correctPassword: boolean = false;
   public setNewPassword: boolean = false;
   public loadingOldPassword: boolean = false;

   public isFormDirty: boolean = false;

   constructor(
      private formBuilder: FormBuilder,
      private inputService: TaInputService,
      private userService: TaUserService,
      private notificationService: NotificationService,
      private modalService: ModalService,
      private formService: FormService
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
         phone: [null, phoneFaxRegex],
         email: [null],
         address: [null, [...addressValidation]],
         addressUnit: [null, [...addressUnitValidation]],
         createNewPassword: [false],
         oldPassword: [null, passwordValidation],
         // New password And password (confirmation)
         newPassword: [null, passwordValidation],
         password: [null, passwordValidation],
         avatar: [null],
      });

      this.inputService.customInputValidator(
         this.profileUserForm.get('email'),
         'email',
         this.destroy$
      );

      this.formService.checkFormChange(this.profileUserForm);
      this.formService.formValueChange$
         .pipe(takeUntil(this.destroy$))
         .subscribe((isFormChange: boolean) => {
            this.isFormDirty = isFormChange;
            console.log(this.isFormDirty);
         });
   }

   public onModalAction(data: { action: string; bool: boolean }): void {
      if (data.action === 'close') {
         return;
      }

      if (this.profileUserForm.invalid || !this.isFormDirty) {
         this.inputService.markInvalid(this.profileUserForm);
         return;
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
                  this.profileUserForm.get('oldPassword'),
                  true,
                  [...passwordValidation]
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
            }
         });

      this.confirmationOldPassword();
   }

   public confirmationOldPassword() {
      this.profileUserForm
         .get('oldPassword')
         .valueChanges.pipe(takeUntil(this.destroy$))
         .subscribe((value) => {
            this.userPasswordTyping = value?.toString().length >= 1;
            if (value && value.length >= 8) {
               this.loadingOldPassword = true;
               this.userService
                  .validateUserPassword({ password: value })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe({
                     next: (res: any) => {
                        this.correctPassword = !!res.correctPassword;
                        this.loadingOldPassword = false;

                        if (!this.correctPassword) {
                           this.profileUserForm
                              .get('oldPassword')
                              .setErrors({ invalid: true });
                        }
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
                  passwordDontMatch: true,
               });
            }
         });
   }

   public onSetNewPassword() {
      if (this.correctPassword) {
         this.setNewPassword = true;
         this.inputService.changeValidators(
            this.profileUserForm.get('newPassword'),
            true,
            [...passwordValidation]
         );
         this.inputService.changeValidators(
            this.profileUserForm.get('password'),
            true,
            [...passwordValidation]
         );
      }
   }

   public onUploadImage(event: any) {
      console.log('upload image ', event);
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
                  phone: res.phone,
                  email: res.email,
                  address: res.address.address,
                  addressUnit: res.address.addressUnit,
                  avatar: res.avatar ? res.avatar : null,
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
               this.notificationService.error(
                  "Can't update your profile.",
                  'Error'
               );
            },
         });
   }

   // Checkbox card
   public passwordCheckboxCard: boolean = true;
   public toggleCheckboxCard() {
      this.passwordCheckboxCard = !this.passwordCheckboxCard;
   }

   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
   }
}
