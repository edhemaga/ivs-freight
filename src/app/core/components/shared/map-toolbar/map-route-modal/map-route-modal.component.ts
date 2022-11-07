import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/core/services/form/form.service';
import { ModalService } from '../../ta-modal/modal.service';
import { TaInputService } from '../../ta-input/ta-input.service';
import { Subject, takeUntil } from 'rxjs';
import { TruckTService } from '../../../truck/state/truck.service';
import { TruckListResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-map-route-modal',
  templateUrl: './map-route-modal.component.html',
  styleUrls: ['./map-route-modal.component.scss'],
})
export class MapRouteModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public mapRouteForm: FormGroup;
  public isFormDirty: boolean = false;

  public routeTabs: { id: number; name: string; checked: boolean }[] = [
    {
      id: 1,
      name: 'Practical',
      checked: true,
    },
    {
      id: 2,
      name: 'Shortest',
      checked: false,
    },
    {
      id: 3,
      name: 'Cheapest',
      checked: false,
    },
  ];

  public selectedTruckType: any = null;
  public truckType: any[] = [];

  public durationCheckboxCard: boolean = true;
  public fuelCostCheckboxCard: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private modalService: ModalService,
    private inputService: TaInputService,
    private truckService: TruckTService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getTrucks();
  }

  private createForm() {
    this.mapRouteForm = this.formBuilder.group({
      routeName: [null, [Validators.required, Validators.maxLength(16)]],
      routeType: [null],
      truckId: [null],
      duration: [null],
      durationTime: [null],
      fuelCost: [null],
      fuelMpg: [null, Validators.maxLength(5)],
      fuelPrice: [null, Validators.maxLength(5)],
    });

    this.formService.checkFormChange(this.mapRouteForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    console.log('from modal, ', data);
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'create-map-route': {
        if (this.mapRouteForm.invalid || !this.isFormDirty) {
          this.inputService.markInvalid(this.mapRouteForm);
          return;
        }
        this.modalService.setModalSpinner({
          action: 'create-map-route',
          status: true,
        });

        console.log('put action create map');

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
        this.mapRouteForm.get('routeType').setValue(event.name);
        break;
      }
      default: {
        break;
      }
    }
  }

  public onSelectDropdown(event: any) {
    this.selectedTruckType = event;
  }

  private getTrucks() {
    this.truckService
      .getTruckList(1, 1, 25)
      .pipe(takeUntil(this.destroy$))
      .subscribe((trucks: TruckListResponse) => {
        console.log('trucks: ', trucks.pagination.data);
        this.truckType = trucks.pagination.data.map((truck) => {
          return {
            ...truck.truckType,
            folder: 'common',
            subFolder: 'trucks',
          };
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
