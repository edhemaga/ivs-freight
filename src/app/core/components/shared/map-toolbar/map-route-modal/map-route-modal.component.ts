import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/core/services/form/form.service';
import { ModalService } from '../../ta-modal/modal.service';
import { TaInputService } from '../../ta-input/ta-input.service';
import { Subject, takeUntil } from 'rxjs';
import { TruckTService } from '../../../truck/state/truck.service';
import {
  TruckListResponse,
  CreateRouteCommand,
} from 'appcoretruckassist';
import { RoutingStateService } from '../../../routing/state/routing-state/routing-state.service';
import { NotificationService } from '../../../../services/notification/notification.service';

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
    private truckService: TruckTService,
    private routingService: RoutingStateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getTrucks();

    if (this.editData?.type === 'edit') {
      this.getRoute(this.editData.id);
    }
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

        if (this.editData?.type === 'edit') {
          if (this.isFormDirty) {
            this.updateRoute(this.editData.id);
            this.modalService.setModalSpinner({
              action: 'create-map-route',
              status: true,
            });
          }
        } else {
          this.addRoute();
          this.modalService.setModalSpinner({
            action: 'create-map-route',
            status: true,
          });
        }

        console.log('put action create map');

        break;
      }

      case 'reset-map-routing': {
        console.log('put action reset map');
        this.resetForm();
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

  private addRoute() {
    const form = this.mapRouteForm.value;

    const newData: CreateRouteCommand = {
      name: form.routeName,
      mapId: this.editData.mapId,
    };

    this.routingService
      .addRoute(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly added route.',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error("Can't add route.", 'Error');
        },
      });
  }

  private updateRoute(id: number) {
    const form = this.mapRouteForm.value;

    const newData: any = {
      id: id,
      name: form.routeName,
      shape: this.editData.shape ? this.editData.shape : '',
      stops: this.editData.stops ? this.editData.stops : [],
    };

    console.log('updateRoute newData', newData);

    this.routingService
      .updateRoute(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly updated route.',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error("Can't update route.", 'Error');
        },
      });
  }

  private getRoute(id: number) {
    this.routingService
      .getRouteById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.mapRouteForm.patchValue({
            routeName: res.name,
          });
          console.log('getRouteById', res);
        },
        error: () => {
          this.notificationService.error("Can't load route.", 'Error');
        },
      });
  }

  private resetForm() {
    if (this.editData?.type === 'edit') {
      this.getRoute(this.editData.id);
    } else {
      this.mapRouteForm.reset();
      this.isFormDirty = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
