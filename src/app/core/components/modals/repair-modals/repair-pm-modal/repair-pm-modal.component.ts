import { PmTService } from './../../../pm-truck-trailer/state/pm.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  convertNumberInThousandSep,
  convertThousanSepInNumber,
} from 'src/app/core/utils/methods.calculations';
import {
  PMTrailerListResponse,
  PMTruckListResponse,
  UpdatePMTrailerListDefaultCommand,
  UpdatePMTrailerUnitListCommand,
  UpdatePMTruckDefaultListCommand,
  UpdatePMTruckUnitListCommand,
} from 'appcoretruckassist';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { debounceTime } from 'rxjs';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';

@UntilDestroy()
@Component({
  selector: 'app-repair-pm-modal',
  templateUrl: './repair-pm-modal.component.html',
  styleUrls: ['./repair-pm-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class RepairPmModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;
  public PMform: FormGroup;

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private pmTService: PmTService,
    private notificationService: NotificationService,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData?.action?.includes('unit-pm')) {
      this.editData = {
        ...this.editData,
        id: 1,
      };
    }
    this.getPMList();
  }

  private createForm() {
    this.PMform = this.formBuilder.group({
      defaultPMs: this.formBuilder.array([]),
      newPMs: this.formBuilder.array([]),
    });

    // this.formService.checkFormChange(this.PMform);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public get defaultPMs(): FormArray {
    return this.PMform.get('defaultPMs') as FormArray;
  }

  public get newPMs(): FormArray {
    return this.PMform.get('newPMs') as FormArray;
  }

  private createDefaultPMs(
    id: number,
    isChecked: boolean = false,
    svg: string,
    title: string,
    mileage: string,
    status: string
  ): FormGroup {
    return this.formBuilder.group({
      id: [id],
      isChecked: [isChecked],
      svg: [svg],
      title: [title],
      mileage: [mileage],
      status: [status],
    });
  }

  private createNewPMs(
    id: number,
    isChecked: boolean,
    svg: string,
    title: string,
    mileage: string,
    value: string,
    hidden: boolean
  ): FormGroup {
    return this.formBuilder.group({
      id: [id],
      isChecked: [isChecked],
      svg: [svg],
      title: [title],
      mileage: [mileage],
      value: [value],
      hidden: [hidden],
    });
  }

  public addPMs(
    data: {
      id: any;
      isChecked: boolean;
      svg: string;
      title: string;
      mileage: string;
      status: any;
    },
    event: string,
    defaultValue?: number
  ) {
    // This if check if new item added or already new items exist, because of 'custom-svg'
    if (event === 'new-pm') {
      if (data?.id) {
        this.newPMs.push(
          this.createNewPMs(
            data.id,
            data.isChecked,
            data.svg,
            data.title,
            data.mileage,
            data.title,
            false
          )
        );
      } else {
        this.newPMs.push(
          this.createNewPMs(
            null,
            true,
            'assets/svg/common/repair-pm/ic_custom_pm.svg',
            null,
            convertNumberInThousandSep(defaultValue),
            null,
            false
          )
        );
      }
    } else {
      this.defaultPMs.push(
        this.createDefaultPMs(
          data.id,
          data.isChecked,
          data.svg,
          data.title,
          data.mileage,
          data.status
        )
      );
    }
  }

  public activePMs() {
    return this.defaultPMs.controls.reduce((accumulator, item: any) => {
      if (item.get('isChecked').value) {
        return (accumulator = accumulator + 1);
      } else {
        return (accumulator = accumulator + 0);
      }
    }, 0);
  }

  public removeNewPMs(id: number) {
    if (this.editData.type === 'new') {
      switch (this.editData.header) {
        case 'Truck': {
          this.deleteTruckPMList(this.newPMs.at(id).value.id);
          break;
        }
        case 'Trailer': {
          this.deleteTrailerPMList(this.newPMs.at(id).value.id);
          break;
        }
        default: {
          break;
        }
      }

      this.newPMs.removeAt(id);
    }
  }

  public onChangeValueNewPM(ind: number) {
    this.newPMs
      .at(ind)
      .get('value')
      .valueChanges.pipe(debounceTime(2000), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.newPMs.at(ind).get('hidden').patchValue(true);
        }
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.PMform.reset();
        break;
      }
      case 'save': {
        if (this.PMform.invalid) {
          this.inputService.markInvalid(this.PMform);
          return;
        }

        switch (this.editData.type) {
          case 'new': {
            switch (this.editData.header) {
              case 'Truck': {
                this.addPMTruckList();
                this.modalService.setModalSpinner({
                  action: null,
                  status: true,
                });
                break;
              }
              case 'Trailer': {
                this.addPMTrailerList();
                this.modalService.setModalSpinner({
                  action: null,
                  status: true,
                });
                break;
              }
              default: {
                break;
              }
            }
            break;
          }
          case 'edit': {
            switch (this.editData.header) {
              case 'Truck': {
                this.addUpdatePMTruckUnit();
                this.modalService.setModalSpinner({
                  action: null,
                  status: true,
                });
                break;
              }
              case 'Trailer': {
                this.addUpdatePMTrailerUnit();
                this.modalService.setModalSpinner({
                  action: null,
                  status: true,
                });
                break;
              }
              default: {
                break;
              }
            }
            break;
          }
          default: {
            break;
          }
        }

        break;
      }

      default: {
        break;
      }
    }
  }

  private getPMTruckList() {
    this.pmTService
      .getPMTruckList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: PMTruckListResponse) => {
          res.pagination.data.forEach((item, index) => {
            const data = {
              id: item.id,
              isChecked: item.status.name === 'Active' || index < 4,
              svg: `assets/svg/common/repair-pm/${item.logoName}`,
              title: item.title,
              mileage: convertNumberInThousandSep(item.mileage),
              status: item.status,
            };

            this.addPMs(
              data,
              item.logoName.includes('custom') ? 'new-pm' : null
            );
          });
        },
        error: () => {
          this.notificationService.error("Can't get trailer PM list.", 'Error');
        },
      });
  }

  private getPMTruckUnit(id: number) {
    this.pmTService
      .getPmTruckUnitIdModal(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: PMTruckListResponse) => {
          console.log(res.pagination.data);
          res.pagination.data.forEach((item, index) => {
            const data = {
              id: item.id,
              isChecked: item.status.name === 'Active' || index < 4,
              svg: `assets/svg/common/repair-pm/${item.logoName}`,
              title: item.title,
              mileage: convertNumberInThousandSep(item.mileage),
              status: item.status.name,
            };

            this.addPMs(
              data,
              item.logoName.includes('custom') ? 'new-pm' : null
            );
          });
        },
        error: () => {
          this.notificationService.error(
            `Can't load Truck Unit By ${id}`,
            'Error'
          );
        },
      });
  }

  private getPMTrailerList() {
    this.pmTService
      .getPMTrailerList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: PMTrailerListResponse) => {
          res.pagination.data.forEach((item) => {
            const data = {
              id: item.id,
              isChecked: item.status.name === 'Active',
              svg: `assets/svg/common/repair-pm/${item.logoName}`,
              title: item.title,
              mileage: convertNumberInThousandSep(item.months),
              status: item.status.name,
            };

            this.addPMs(
              data,
              item.logoName.includes('custom') ? 'new-pm' : null
            );
          });
        },
        error: () => {
          this.notificationService.error("Can't get trailer PM list.", 'Error');
        },
      });
  }

  private getPMTrailerUnit(id: number) {
    this.pmTService
      .getPmTrailerUnitIdModal(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: PMTrailerListResponse) => {
          res.pagination.data.forEach((item) => {
            const data = {
              id: item.id,
              isChecked: item.status.name === 'Active',
              svg: `assets/svg/common/repair-pm/${item.logoName}`,
              title: item.title,
              mileage: convertNumberInThousandSep(item.months),
              status: item.status,
            };

            this.addPMs(
              data,
              item.logoName.includes('custom') ? 'new-pm' : null
            );
          });
        },
        error: () => {
          this.notificationService.error(
            `Can't load Trailer Unit By ${id}`,
            'Error'
          );
        },
      });
  }

  private addPMTruckList() {
    const newData: UpdatePMTruckDefaultListCommand = {
      pmTruckDefaults: [
        ...this.defaultPMs.controls.map((item, index) => {
          return {
            id: item.get('id').value,
            title: item.get('title').value,
            mileage: convertThousanSepInNumber(item.get('mileage').value),
            status:
              index < 4
                ? item.get('status').value.name
                : item.get('isChecked').value
                ? 'Active'
                : 'Inactive',
          };
        }),
        ...this.newPMs.controls.map((item: any) => {
          return {
            id: item.get('id').value,
            title: item.get('value').value,
            mileage: convertThousanSepInNumber(item.get('mileage').value),
            status: item.get('isChecked').value ? 'Active' : 'Inactive',
          };
        }),
      ],
    };

    this.pmTService
      .addUpdatePMTruckList(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully added PM Item in PM List',
            'Success'
          );
          this.modalService.setModalSpinner({
            action: null,
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Can't add PM Item in PM List",
            'Error'
          );
        },
      });
  }

  private addPMTrailerList() {
    const newData: UpdatePMTrailerListDefaultCommand = {
      pmTrailerDefaults: [
        ...this.defaultPMs.controls.map((item, index) => {
          return {
            id: item.get('id').value,
            title: item.get('title').value,
            months: convertThousanSepInNumber(item.get('mileage').value),
            status:
              index < 1
                ? item.get('status').value
                : item.get('isChecked').value
                ? 'Active'
                : 'Inactive',
          };
        }),
        ...this.newPMs.controls.map((item: any) => {
          return {
            id: item.get('id').value,
            title: item.get('value').value,
            months: convertThousanSepInNumber(item.get('mileage').value),
            status: item.get('isChecked').value ? 'Active' : 'Inactive',
          };
        }),
      ],
    };

    this.pmTService
      .addUpdatePMTrailerList(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully added PM Item in PM List',
            'Success'
          );
          this.modalService.setModalSpinner({
            action: null,
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Can't add PM Item in PM List",
            'Error'
          );
        },
      });
  }

  private addUpdatePMTruckUnit() {
    const newData: UpdatePMTruckUnitListCommand = {
      truckId: this.editData.id,
      pmTrucks: [
        ...this.defaultPMs.controls.map((item, index) => {
          return {
            id: item.get('id').value,
            mileage: convertThousanSepInNumber(item.get('mileage').value),
          };
        }),
      ],
    };
    console.log(newData);
    this.pmTService
      .addUpdatePMTruckUnit(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully added PM Item in PM Unit List',
            'Success'
          );
          this.modalService.setModalSpinner({
            action: null,
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Can't add PM Item in PM Unit List",
            'Error'
          );
        },
      });
  }

  private addUpdatePMTrailerUnit() {
    const newData: UpdatePMTrailerUnitListCommand = {
      trailerId: this.editData.id,
      pmTrailers: [
        ...this.defaultPMs.controls.map((item) => {
          return {
            id: item.get('id').value,
            months: convertThousanSepInNumber(item.get('mileage').value),
          };
        }),
      ],
    };
    console.log(newData);
    this.pmTService
      .addUpdatePMTrailerUnit(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully added PM Item in PM List',
            'Success'
          );
          this.modalService.setModalSpinner({
            action: null,
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Can't add PM Item in PM List",
            'Error'
          );
        },
      });
  }

  private getPMList() {
    switch (this.editData.type) {
      case 'new': {
        switch (this.editData.header) {
          case 'Truck': {
            this.getPMTruckList();
            break;
          }
          case 'Trailer': {
            this.getPMTrailerList();
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      case 'edit': {
        switch (this.editData.header) {
          case 'Truck': {
            this.getPMTruckUnit(this.editData.id);
            break;
          }
          case 'Trailer': {
            this.getPMTrailerUnit(this.editData.id);
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  private deleteTruckPMList(id: number) {
    this.pmTService
      .deletePMTruckById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Successfully delete Truck PM By ${id}`,
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            `Can't delete Truck PM By ${id}`,
            'Error'
          );
        },
      });
  }

  private deleteTrailerPMList(id: number) {
    this.pmTService
      .deletePMTrailerById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Successfully delete Trailer PM By ${id}`,
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            `Can't delete Trailer Unit By ${id}`,
            'Error'
          );
        },
      });
  }

  ngOnDestroy(): void {}
}
