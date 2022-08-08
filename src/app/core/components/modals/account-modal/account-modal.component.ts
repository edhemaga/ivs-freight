import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { v4 as uuidv4 } from 'uuid';
import {
  AccountColorResponse,
  CompanyAccountModalResponse,
  CompanyAccountResponse,
  CreateCompanyAccountCommand,
  CreateResponse,
  UpdateCompanyAccountCommand,
} from 'appcoretruckassist';
import { AccountModalService } from './account-modal.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { AccountTService } from '../../account/state/account.service';

@UntilDestroy()
@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, FormService],
})
export class AccountModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public accountForm: FormGroup;

  public accountLabels: any[] = [];
  public selectedAccountLabel: any = null;
  public sendAccountLabelId: any = null;

  public colors: any[] = [];
  public selectedAccountColor: any = {
    id: 1,
    name: 'No Color',
    code: null,
    count: 0,
  };

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private accountModalService: AccountModalService,
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
  }

  private createForm(): void {
    this.accountForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(23)]],
      username: [null, [Validators.required, Validators.maxLength(40)]],
      password: [null, [Validators.required, Validators.maxLength(20)]],
      url: [null],
      companyAccountLabelId: [null],
      note: [null],
    });

    // this.formService.checkFormChange(this.accountForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.accountForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.accountForm.invalid) {
          this.inputService.markInvalid(this.accountForm);
          return;
        }
        if (this.editData) {
          this.updateCompanyAccount(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addCompanyAccount();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        if (this.editData) {
          this.deleteCompanyAccountById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CompanyAccountModalResponse) => {
          this.accountLabels = res.labels;
        },
      });
  }

  private companyAccountColorLabels() {
    this.accountModalService
      .companyAccountLabelsColorList()
      .pipe(untilDestroyed(this))
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
      .pipe(untilDestroyed(this))
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
        error: (err) => {
          this.notificationService.error("Can't get account.", 'Error:');
        },
      });
  }

  private addCompanyAccount(): void {
    const newData: CreateCompanyAccountCommand = {
      ...this.accountForm.value,
      api: 1,
      apiCategory: 'EFSFUEL',
      companyAccountLabelId: this.sendAccountLabelId
        ? this.sendAccountLabelId
        : this.selectedAccountLabel
        ? this.selectedAccountLabel.id
        : null,
    };
    this.accountService
      .addCompanyAccount(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Company Account successfully created.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
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
      companyAccountLabelId: this.sendAccountLabelId
        ? this.sendAccountLabelId
        : this.selectedAccountLabel
        ? this.selectedAccountLabel.id
        : null,
    };
    this.accountService
      .updateCompanyAccount(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Company Account successfully edit..',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Company Account successfully deleted.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
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
  }

  public onSaveLabel(data: { action: string; label: string }) {
    if (data.action === 'cancel') {
      this.selectedAccountLabel = {
        name: data.label,
        code: this.selectedAccountColor.code,
        count: this.selectedAccountColor.count
          ? this.selectedAccountColor.count
          : null,
        createdAt: null,
        updatedAt: null,
      };
      return;
    }
    this.selectedAccountLabel = {
      id: uuidv4(),
      name: data.label,
      code: this.selectedAccountColor.code,
      count: this.selectedAccountColor.count,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.accountLabels = [...this.accountLabels, this.selectedAccountLabel];

    this.accountModalService
      .addCompanyLabel({
        name: data.label,
        colorId: this.selectedAccountColor.id,
      })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CreateResponse) => {
          this.sendAccountLabelId = res.id;
          this.notificationService.success(
            'Successfully add account label.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Can't add account label.", 'Error:');
        },
      });
  }

  ngOnDestroy(): void {}
}
