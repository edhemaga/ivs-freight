import { untilDestroyed } from 'ngx-take-until-destroy';
import { emailRegex } from './../../shared/ta-input/ta-input.regex-validations';
import { phoneRegex } from '../../shared/ta-input/ta-input.regex-validations';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-profile-update-modal',
  templateUrl: './profile-update-modal.component.html',
  styleUrls: ['./profile-update-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
})
export class ProfileUpdateModalComponent implements OnInit, OnDestroy {
  @Input() user: any;

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

  public correctPassword: boolean = false;
  public setNewPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService
  ) {}

  ngOnInit() {
    this.createForm();
    this.changeCheckDetection();
    this.confirmationOldPassword();
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
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      mobile: [null, phoneRegex],
      email: [null, emailRegex],
      address: [null],
      addressUnit: [null],
      createNewPassword: [false],
      checkingOldPassword: [null],
      oldPassword: [null],
      newPassword: [null],
      password: [null],
      avatar: [null],
    });
  }

  public changeCheckDetection() {
    this.profileUserForm
      .get('createNewPassword')
      .valueChanges.pipe(untilDestroyed(this))
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
          this.setNewPassword = false;
          this.correctPassword = false;
          this.inputService.changeValidators(
            this.profileUserForm.get('checkingOldPassword'),
            false
          );
        }
      });
  }

  public confirmationOldPassword() {
    this.profileUserForm
      .get('oldPassword')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value.length > 3) {
          this.correctPassword = true;
          this.inputService.changeValidators(
            this.profileUserForm.get('checkingOldPassword')
          );
        } else {
          this.correctPassword = false;
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

  public onImageValidation(event: boolean) {
    if (event) {
      this.inputService.changeValidators(this.profileUserForm.get('avatar'));
    } else {
      this.inputService.changeValidators(
        this.profileUserForm.get('avatar'),
        false
      );
    }
  }

  public onUploadImage(event: any) {
    this.profileUserForm.get('avatar').patchValue(event);
  }

  private getUserById() {}

  public onModalAction(data: { action: string; bool: boolean }): void {}

  addressFlag: string = 'Empty';

  public onHandleAddress(event: any) {
    console.log(event);
  }

  ngOnDestroy(): void {}
}
