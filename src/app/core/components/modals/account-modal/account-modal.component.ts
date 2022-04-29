import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { CompanyAccountModalResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountModalComponent implements OnInit {
  @Input() editData: any;
  
  public accountForm: FormGroup;
  public accountLabels$: Observable<CompanyAccountModalResponse>;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getAccountLabels();
  }

  private createForm() {
    this.accountForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(23)]],
      username: [null, [Validators.required, Validators.maxLength(40)]],
      password: [null, [Validators.required, Validators.maxLength(20)]],
      url: [null, [Validators.required, Validators.maxLength(400)]],
      companyAccountLabel: [null, [Validators.required]],
      note: [null],
    });
  }

  public onModalAction(action: string) {
    if (action === 'close') {
      this.accountForm.reset();
    } else {
      if (this.accountForm.invalid) {
        console.log(this.accountForm.value);
        this.inputService.markInvalid(this.accountForm);
        return;
      }
      // this.modalService.addCompanyAccount()
      this.ngbActiveModal.close();
    }
  }

  public getAccountLabels() {
    this.accountLabels$ =  this.modalService.companyAccountModalGet();
  }
}
