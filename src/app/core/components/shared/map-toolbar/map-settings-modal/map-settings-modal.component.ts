import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../../services/form/form.service';
import { ModalService } from '../../ta-modal/modal.service';
import { TaInputService } from '../../ta-input/ta-input.service';

@Component({
  selector: 'app-map-settings-modal',
  templateUrl: './map-settings-modal.component.html',
  styleUrls: ['./map-settings-modal.component.scss'],
})
export class MapSettingsModalComponent implements OnInit, OnDestroy {
  public mapSettingsForm: FormGroup;
  public isFormDirty: boolean = false;

  public distanceTabs: { id: number; name: string; checked: boolean }[] = [
    {
      id: 1,
      name: 'Miles',
      checked: false,
    },
    {
      id: 2,
      name: 'Km',
      checked: false,
    },
  ];

  public addressTabs: { id: number; name: string; checked: boolean }[] = [
    {
      id: 1,
      name: 'City',
      checked: false,
    },
    {
      id: 2,
      name: 'Address',
      checked: false,
    },
  ];

  public borderTabs: { id: number; name: string; checked: boolean }[] = [
    {
      id: 1,
      name: 'Open Border',
      checked: false,
    },
    {
      id: 2,
      name: 'Closed Border',
      checked: false,
    },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private modalService: ModalService,
    private inputService: TaInputService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.mapSettingsForm = this.formBuilder.group({
      mapName: [null, [Validators.required, Validators.maxLength(16)]],
      distanceUnit: [null],
      addressType: [null],
      borderType: [null],
    });

    this.formService.checkFormChange(this.mapSettingsForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'set-map-settings': {
        if (this.mapSettingsForm.invalid || !this.isFormDirty) {
          this.inputService.markInvalid(this.mapSettingsForm);
          return;
        }
        this.modalService.setModalSpinner({
          action: 'set-map-settings',
          status: true,
        });

        console.log('put action set map');

        break;
      }
      case 'reset-map-routing': {
        console.log('put action reset map');
        break;
      }
      default: {
        break;
      }
    }
  }

  public onTabChange(event: any, type: string): void {
    switch (type) {
      case 'Distance-tab': {
        let distanceUnit = event.name == 'Miles' ? 'mi' : 'km';

        this.mapSettingsForm.get('distanceUnit').setValue(distanceUnit);
        break;
      }
      case 'Address-tab': {
        let addressType = event.name == 'City' ? 'city' : 'address';

        this.mapSettingsForm.get('addressType').setValue(addressType);
        break;
      }
      case 'Border-tab': {
        let borderType = event.name == 'Open Border' ? 'open' : 'closed';

        this.mapSettingsForm.get('borderType').setValue(borderType);
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
