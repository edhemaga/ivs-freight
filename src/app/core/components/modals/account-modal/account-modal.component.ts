import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
  CompanyAccountModalResponse,
  CompanyAccountResponse,
  CreateCompanyAccountCommand,
} from 'appcoretruckassist';
import { AccountModalService } from './account-modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public accountForm: FormGroup;
  public accountLabels$: Observable<CompanyAccountModalResponse>;
  public selectedAccountLabel: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private modalService: ModalService,
    private accountModalService: AccountModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getAccountLabels();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 2,
      };
      this.editCompanyAccount(this.editData.id);
    }
  }

  private createForm(): void {
    this.accountForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(23)]],
      username: [null, [Validators.required, Validators.maxLength(40)]],
      password: [null, [Validators.required, Validators.maxLength(20)]],
      url: [null, [Validators.required, Validators.maxLength(400)]],
      companyAccountLabelId: [null, [Validators.required]],
      note: [null],
    });
  }

  public onModalAction(action: string) {
    if (action === 'close') {
      this.accountForm.reset();
    } else {
      // If Form not valid
      if (this.accountForm.invalid) {
        this.inputService.markInvalid(this.accountForm);
        return;
      }
      // Save & Update
      if (action === 'save') {
        if (this.editData) {
          this.updateCompanyAccount(this.editData.id);
        } else {
          this.addCompanyAccount();
        }
      }

      // Delete
      if (action === 'delete' && this.editData) {
        this.deleteCompanyAccount(this.editData.id);
      }

      this.ngbActiveModal.close();
    }
  }

  private getAccountLabels(): void {
    this.accountLabels$ = this.modalService.companyAccountModalGet();
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
            companyAccountLabelId: res.companyAccountLabel.name,
            note: res.note,
          });
          this.selectedAccountLabel = res.companyAccountLabel;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private addCompanyAccount(): void {
    const newData: CreateCompanyAccountCommand = {
      ...this.accountForm.value,
      api: 1,
      apiCategory: 'EFSFUEL',
      companyAccountLabelId: this.selectedAccountLabel.id,
    };
    this.accountModalService
      .addCompanyAccount(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Company Account successfully created.',
            'Success:'
          ),
        error: () =>
          this.notificationService.error(
            "Company Account can't be created.",
            'Error:'
          ),
      });
  }

  private updateCompanyAccount(id: number): void {
    const newData: CreateCompanyAccountCommand = {
      ...this.accountForm.value,
      api: 1,
      apiCategory: 'EFSFUEL',
      companyAccountLabelId: this.selectedAccountLabel.id,
      id: id,
    };
    this.accountModalService
      .updateCompanyAccount(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Company Account successfully edit..',
            'Success:'
          ),
        error: () =>
          this.notificationService.error(
            "Company Account can't be edit.",
            'Error:'
          ),
      });
  }

  public deleteCompanyAccount(id: number): void {
    this.accountModalService
      .deleteCompanyAccount(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Company Account successfully deleted.',
            'Success:'
          ),
        error: () =>
          this.notificationService.error(
            "Company Account can't be deleted.",
            'Error:'
          ),
      });
  }

  public onSelectLabel(event: any): void {
    this.selectedAccountLabel = event;
  }

  ngOnDestroy(): void {}
}
