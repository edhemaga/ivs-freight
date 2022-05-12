import { ContactModalService } from './contact-modal.service';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  CompanyContactModalResponse,
  CompanyContactResponse,
  CreateCompanyContactCommand,
  UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import { MockModalService } from 'src/app/core/services/mockmodal.service';
import { Address } from '../../shared/ta-input-address/ta-input-address.component';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
})
export class ContactModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public contactForm: FormGroup;
  public contactLabels: any[] = [];
  public sharedDepartments: any[] = [];

  public selectedContactLabel: any = null;
  public selectedSharedDepartment: any = null;
  public selectedAddress: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private contactModalService: ContactModalService,
    private notificationService: NotificationService,
    private mockModalService: MockModalService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getContactLabelsAndDepartments();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 2,
      };
      this.editCompanyContact(this.editData.id);
    }
  }

  private createForm() {
    this.contactForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(23)]],
      companyContactLabelId: [null],
      phone: [null, [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]],
      email: [
        null,
        [Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)],
      ],
      address: [null],
      addressUnit: [null, [Validators.maxLength(6)]],
      shared: [false],
      sharedLabelId: [null],
      note: [null],
    });
  }

  public onModalAction(data: {action: string, bool: boolean}) {
    if (data.action === 'close') {
      this.contactForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.contactForm.invalid) {
          this.inputService.markInvalid(this.contactForm);
          return;
        }
        if (this.editData) {
          this.updateCompanyContact(this.editData.id);
        } else {
          this.addCompanyContact();
        }
      }

      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteCompanyContactById(this.editData.id);
      }

      this.ngbActiveModal.close();
    }
  }

  public openCloseCheckboxCard(event: any) {
    if (this.contactForm.get('shared').value) {
      event.preventDefault();
      event.stopPropagation();
      this.contactForm.get('shared').setValue(false);
    }
  }

  private getContactLabelsAndDepartments() {
    this.contactModalService
      .companyContactLabelsAndDeparments()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CompanyContactModalResponse) => {
          this.contactLabels = res.labels;
          this.sharedDepartments = res.departments;
          this.sharedDepartments = this.mockModalService.sharedLabels;
        },
        error: () => {
          this.notificationService.error(
            "Can't get contact labels and departments.",
            'Error:'
          );
        },
      });
  }

  private editCompanyContact(id: number) {
    this.contactModalService
      .getCompanyContactById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CompanyContactResponse) => {
          console.log(res)
          this.contactForm.patchValue({
            name: res.name,
            companyContactLabelId: res.companyContactLabel ? res.companyContactLabel.name : null,
            phone: res.phone,
            email: res.email,
            address: res.address ? res.address.address : null,
            addressUnit: res.address ? res.address.addressUnit : null,
            shared: res.shared,
            sharedLabelId: null, // TODO: Ceka se BACK
            note: res.note,
          });
          this.selectedContactLabel = res.companyContactLabel;
          this.selectedAddress = res.address
          // TODO: shared departments label selected
        },
        error: () => {
          this.notificationService.error("Can't get contact.", 'Error:');
        },
      });
  }

  private addCompanyContact(): void {
    const { sharedLabelId, addressUnit, ...form } = this.contactForm.value;
    const { streetName, streetNumber, ...address } = this.selectedAddress || {};

    const newData: CreateCompanyContactCommand = {
      ...form,
      companyContactLabelId: this.selectedContactLabel ? this.selectedContactLabel.id : null,
      address: {
        ...address,
        addressUnit,
      },
    };
    this.contactModalService
      .addCompanyContact(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Company Contact successfully created.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            "Company Contact can't be created.",
            'Error:'
          );
        },
      });
  }

  private updateCompanyContact(id: number): void {
    const { sharedLabelId, addressUnit, ...form } = this.contactForm.value;
    const { streetName, streetNumber, ...address } = this.selectedAddress || {};
    const newData: UpdateCompanyContactCommand = {
      id: id,
      ...form,
      companyContactLabelId: this.selectedContactLabel ? this.selectedContactLabel.id : null,
      address: {
        ...address,
        addressUnit,
      }
    };
    console.log(newData)
    this.contactModalService
      .updateCompanyContact(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Company Contact successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            "Company Contact can't be updated.",
            'Error:'
          );
        },
      });
  }

  public deleteCompanyContactById(id: number): void {
    this.contactModalService
      .deleteCompanyContactById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Company Contact successfully deleted.',
            'Success:'
          ),
        error: () =>
          this.notificationService.error(
            "Company Contact can't be deleted.",
            'Error:'
          ),
      });
  }

  public onSelectLabel(event: any): void {
    this.selectedContactLabel = event;
  }

  public onSelectDepartment(event: any): void {
    this.selectedSharedDepartment = event;
  }

  public onHandleAddress(event: {address: Address, valid: boolean}): void {
    this.selectedAddress = event.address;
    if(!event.valid) {
      this.contactForm.setErrors({'invalid': event.valid})
    }
  }

  ngOnDestroy(): void {}
}
