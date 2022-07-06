import { Observable } from 'rxjs';
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
  CompanyAccountResponse,
  CreateCompanyAccountCommand,
  GetCompanyAccountLabelListResponse,
  UpdateCompanyAccountCommand,
} from 'appcoretruckassist';
import { AccountModalService } from './account-modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { urlRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { FormService } from 'src/app/core/services/form/form.service';

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
  public selectedAccountLabel: any = {
    id: 1,
    name: 'No Color',
    color: null,
    count: null,
  };

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private accountModalService: AccountModalService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getAccountLabels();
    this.companyAccountModal();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editCompanyAccount(this.editData.id);
    }
  }

  private createForm(): void {
    this.accountForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(23)]],
      username: [null, [Validators.required, Validators.maxLength(40)]],
      password: [null, [Validators.required, Validators.maxLength(20)]],
      url: [null, [Validators.required, ...urlRegex]],
      companyAccountLabelId: [null],
      note: [null],
    });

    this.formService.checkFormChange(this.accountForm);

    this.formService.formValueChange$
      .pipe(untilDestroyed(this))
      .subscribe((isFormChange: boolean) => {
        isFormChange ? (this.isDirty = false) : (this.isDirty = true);
      });
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
    this.accountModalService
      .companyAccountModal()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          console.log('MODAL');
          console.log(res);
        },
      });
  }

  private getAccountLabels(): void {
    this.accountModalService
      .companyAccountLabelsList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: GetCompanyAccountLabelListResponse) => {
          console.log('LISTA');
          console.log(res.pagination.data);
          this.accountLabels = res.pagination.data;
        },
        error: () => {},
      });
  }

  private editCompanyAccount(id: number) {
    this.accountModalService
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
      companyAccountLabelId: this.selectedAccountLabel
        ? this.selectedAccountLabel.id
        : null,
    };
    this.accountModalService
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
      companyAccountLabelId: this.selectedAccountLabel
        ? this.selectedAccountLabel.id
        : null,
    };
    this.accountModalService
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
    this.accountModalService
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

  public onSelectColorLabel(event: any): void {
    this.selectedAccountLabel = event;
  }

  public onSaveLabel(event: string) {
    console.log('ACCOUNT MODAL');
    console.log(this.accountForm.get('companyAccountLabelId').value);
    console.log(event, this.selectedAccountLabel);
  }

  ngOnDestroy(): void {}
}
