import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
   Component,
   Input,
   OnInit,
   ViewEncapsulation,
   OnDestroy,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import {
   AccountColorResponse,
   CompanyAccountModalResponse,
   CompanyAccountResponse,
   CreateCompanyAccountCommand,
   CreateResponse,
   UpdateCompanyAccountCommand,
} from 'appcoretruckassist';

import { ModalService } from '../../shared/ta-modal/modal.service';
import { AccountTService } from '../../account/state/account.service';
import { Subject, takeUntil } from 'rxjs';
import {
   labelValidation,
   passwordValidation,
   urlValidation,
   usernameValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { NotificationService } from '../../../services/notification/notification.service';
import { FormService } from '../../../services/form/form.service';

@Component({
   selector: 'app-account-modal',
   templateUrl: './account-modal.component.html',
   styleUrls: ['./account-modal.component.scss'],
   encapsulation: ViewEncapsulation.None,
   providers: [ModalService, FormService],
})
export class AccountModalComponent implements OnInit, OnDestroy {
   private destroy$ = new Subject<void>();
   @Input() editData: any;

   public accountForm: FormGroup;

   public accountLabels: any[] = [];
   public selectedAccountLabel: any = null;

   public colors: any[] = [];
   public selectedAccountColor: any;

   public isFormDirty: boolean;

   constructor(
      private formBuilder: FormBuilder,
      private inputService: TaInputService,
      private notificationService: NotificationService,
      private modalService: ModalService,
      private accountService: AccountTService,
      private formService: FormService
   ) {}

   ngOnInit() {
      this.createForm();
      this.companyAccountModal();
      this.companyAccountColorLabels();

      if (this.editData) {
         this.editCompanyAccount(this.editData.id);
      }

      this.inputService.customInputValidator(
         this.accountForm.get('url'),
         'url',
         this.destroy$
      );
   }

   private createForm(): void {
      this.accountForm = this.formBuilder.group({
         name: [null, [Validators.required, ...labelValidation]],
         username: [null, [Validators.required, ...usernameValidation]],
         password: [null, [Validators.required, ...passwordValidation]],
         url: [null, urlValidation],
         companyAccountLabelId: [null],
         note: [null],
      });

      this.inputService.customInputValidator(
         this.accountForm.get('url'),
         'url',
         this.destroy$
      );

      this.formService.checkFormChange(this.accountForm);
      this.formService.formValueChange$
         .pipe(takeUntil(this.destroy$))
         .subscribe((isFormChange: boolean) => {
            this.isFormDirty = isFormChange && !this.disabledFormValidation;
         });
   }

   public onModalAction(data: { action: string; bool: boolean }) {
      switch (data.action) {
         case 'close': {
            break;
         }
         case 'save': {
            // If Form not valid
            if (this.accountForm.invalid || !this.isFormDirty) {
               this.inputService.markInvalid(this.accountForm);
               return;
            }
            if (this.editData) {
               this.updateCompanyAccount(this.editData.id);
               this.modalService.setModalSpinner({
                  action: null,
                  status: true,
               });
            } else {
               this.addCompanyAccount();
               this.modalService.setModalSpinner({
                  action: null,
                  status: true,
               });
            }
            break;
         }
         case 'delete': {
            if (this.editData) {
               this.deleteCompanyAccountById(this.editData.id);
               this.modalService.setModalSpinner({
                  action: 'delete',
                  status: true,
               });
            }
            break;
         }
         default: {
            break;
         }
      }
   }

   private companyAccountModal(): void {
      this.accountService
         .companyAccountModal()
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: (res: CompanyAccountModalResponse) => {
               this.accountLabels = res.labels;
            },
         });
   }

   private companyAccountColorLabels() {
      this.accountService
         .companyAccountLabelsColorList()
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: (res: Array<AccountColorResponse>) => {
               this.colors = res;
            },
            error: () => {
               this.notificationService.error(
                  "Can't get account color labels.",
                  'Error:'
               );
            },
         });
   }

   private editCompanyAccount(id: number) {
      this.accountService
         .getCompanyAccountById(id)
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: (res: CompanyAccountResponse) => {
               this.accountForm.patchValue({
                  name: res.name,
                  username: res.username,
                  password: res.password,
                  url: res.url,
                  companyAccountLabelId: res.companyAccountLabel
                     ? res.companyAccountLabel.name
                     : null,
                  note: res.note,
               });
               this.selectedAccountLabel = res.companyAccountLabel;
            },
            error: () => {
               this.notificationService.error("Can't get account.", 'Error:');
            },
         });
   }

   private addCompanyAccount(): void {
      const newData: CreateCompanyAccountCommand = {
         ...this.accountForm.value,
         api: 1,
         apiCategory: 'EFSFUEL',
         companyAccountLabelId: this.selectedAccountLabel
            ? this.selectedAccountLabel.id
            : null,
      };
      this.accountService
         .addCompanyAccount(newData)
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: () => {
               this.notificationService.success(
                  'Company Account successfully created.',
                  'Success:'
               );
            },
            error: () =>
               this.notificationService.error(
                  "Company Account can't be created.",
                  'Error:'
               ),
         });
   }

   private updateCompanyAccount(id: number): void {
      const newData: UpdateCompanyAccountCommand = {
         id: id,
         ...this.accountForm.value,
         api: 1,
         apiCategory: 'EFSFUEL',
         companyAccountLabelId: this.selectedAccountLabel
            ? this.selectedAccountLabel.id
            : null,
      };
      this.accountService
         .updateCompanyAccount(newData)
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: () => {
               this.notificationService.success(
                  'Company Account successfully edit..',
                  'Success:'
               );
            },
            error: () =>
               this.notificationService.error(
                  "Company Account can't be edit.",
                  'Error:'
               ),
         });
   }

   public deleteCompanyAccountById(id: number): void {
      this.accountService
         .deleteCompanyAccountById(id)
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: () => {
               this.notificationService.success(
                  'Company Account successfully deleted.',
                  'Success:'
               );
            },
            error: () =>
               this.notificationService.error(
                  "Company Account can't be deleted.",
                  'Error:'
               ),
         });
   }

   public onPickExistLabel(event: any) {
      this.selectedAccountLabel = event;
   }

   public onSelectColorLabel(event: any): void {
      this.selectedAccountColor = event;
      this.selectedAccountLabel = {
         ...this.selectedAccountLabel,
         colorId: this.selectedAccountColor.id,
         color: this.selectedAccountColor.name,
         code: this.selectedAccountColor.code,
         hoverCode: this.selectedAccountColor.hoverCode,
      };
   }

   public onSaveLabel(data: { data: any; action: string }) {
      switch (data.action) {
         case 'edit': {
            this.selectedAccountLabel = data.data;
            this.accountService
               .updateCompanyAccountLabel({
                  id: this.selectedAccountLabel.id,
                  name: this.selectedAccountLabel.name,
                  colorId: this.selectedAccountLabel.colorId,
               })
               .pipe(takeUntil(this.destroy$))
               .subscribe({
                  next: () => {
                     this.notificationService.success(
                        'Successfuly updated label',
                        'Success'
                     );

                     this.accountService
                        .companyAccountModal()
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                           next: (res: CompanyAccountModalResponse) => {
                              this.accountLabels = res.labels;
                           },
                           error: () => {
                              this.notificationService.error(
                                 "Can't get account label list.",
                                 'Error'
                              );
                           },
                        });
                  },
                  error: () => {
                     this.notificationService.error(
                        "Can't update exist label",
                        'Error'
                     );
                  },
               });
            break;
         }
         case 'new': {
            this.selectedAccountLabel = {
               id: data.data.id,
               name: data.data.name,
               code: this.selectedAccountColor
                  ? this.selectedAccountColor.code
                  : this.colors[this.colors.length - 1].code,
               hoverCode: this.selectedAccountColor
                  ? this.selectedAccountColor.hoverCode
                  : this.colors[this.colors.length - 1].hoverCode,
               count: 0,
               colorId: this.selectedAccountColor
                  ? this.selectedAccountColor.id
                  : this.colors[this.colors.length - 1].id,
               color: this.selectedAccountColor
                  ? this.selectedAccountColor.name
                  : this.colors[this.colors.length - 1].name,
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            };

            this.accountService
               .addCompanyAccountLabel({
                  name: this.selectedAccountLabel.name,
                  colorId: this.selectedAccountLabel.colorId,
               })
               .pipe(takeUntil(this.destroy$))
               .subscribe({
                  next: (res: CreateResponse) => {
                     this.notificationService.success(
                        'Successfully add account label.',
                        'Success:'
                     );

                     this.selectedAccountLabel = {
                        ...this.selectedAccountLabel,
                        id: res.id,
                     };

                     this.accountService
                        .companyAccountModal()
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                           next: (res: CompanyAccountModalResponse) => {
                              this.accountLabels = res.labels;
                           },
                           error: () => {
                              this.notificationService.error(
                                 "Can't get account label list.",
                                 'Error'
                              );
                           },
                        });
                  },
                  error: () => {
                     this.notificationService.error(
                        "Can't add account label.",
                        'Error:'
                     );
                  },
               });
            break;
         }
         default: {
            break;
         }
      }
   }

   public disabledFormValidation: boolean = false;
   public companyAccountLabelMode(event: boolean) {
      this.disabledFormValidation = event;
   }

   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
   }
}
