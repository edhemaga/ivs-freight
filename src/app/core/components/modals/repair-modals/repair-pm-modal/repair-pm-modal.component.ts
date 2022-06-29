import { PmTService } from './../../../pm-truck-trailer/state/pm.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
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

@Component({
  selector: 'app-repair-pm-modal',
  templateUrl: './repair-pm-modal.component.html',
  styleUrls: ['./repair-pm-modal.component.scss'],
  providers: [ModalService],
})
export class RepairPmModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;
  public PMform: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private pmTService: PmTService,
    private notificationService: NotificationService,
    private inputService: TaInputService,
    private modalService: ModalService
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
    id: number = null,
    isChecked: boolean = false,
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
    event: any
  ) {
    if (event === 'new-pm') {
      if (data) {
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
            '',
            convertNumberInThousandSep(5000),
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
      console.log('BEFORE DELETE');
      console.log(this.newPMs.at(id).value);
      this.newPMs.removeAt(id);
    }
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
                this.addPMTruckUnit();
                this.modalService.setModalSpinner({
                  action: null,
                  status: true,
                });
                break;
              }
              case 'Trailer': {
                this.addPMTrailerUnit();
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
        ...this.newPMs.controls.map((item) => {
          return {
            id: null,
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
        ...this.newPMs.controls.map((item) => {
          return {
            id: null,
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

  private addPMTruckUnit() {
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

  private addPMTrailerUnit() {
    const newData: UpdatePMTrailerUnitListCommand = {
      trailerId: this.editData.id,
      pmTrailers: [
        ...this.defaultPMs.controls.map((item) => {
          return {
            id: item.get('id').value,
            months: convertThousanSepInNumber(item.get('mileage').value),
          };
        }),
        ...this.newPMs.controls.map((item) => {
          return {
            id: null,
            months: convertThousanSepInNumber(item.get('mileage').value),
          };
        }),
      ],
    };

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

  public onMilesMonthChange(ind: number, type: string, oldNew: string) {
    switch (type) {
      case 'Truck': {
        if (oldNew === 'old') {
          this.defaultPMs
            .at(ind)
            .get('mileage')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((value) => {
              if (!value || value < 1000) {
                this.defaultPMs
                  .at(ind)
                  .get('mileage')
                  .patchValue(convertNumberInThousandSep(1000));
              }
            });
        }

        if (this.newPMs.length && oldNew === 'new') {
          this.newPMs
            .at(ind)
            .get('mileage')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((value) => {
              if (!value || value < 1000) {
                this.newPMs
                  .at(ind)
                  .get('mileage')
                  .patchValue(convertNumberInThousandSep(1000));
              }
            });
        }
        break;
      }
      case 'Trailer': {
        if (oldNew === 'old') {
          this.defaultPMs
            .at(ind)
            .get('mileage')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((value) => {
              if (!value || value == 0) {
                this.defaultPMs
                  .at(ind)
                  .get('mileage')
                  .patchValue(convertNumberInThousandSep(1));
              }
            });
        }

        if (this.newPMs.length && oldNew === 'new') {
          this.newPMs
            .at(ind)
            .get('mileage')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((value) => {
              if (!value || value == 0) {
                this.newPMs
                  .at(ind)
                  .get('mileage')
                  .patchValue(convertNumberInThousandSep(1));
              }
            });
        }
        break;
      }
      default: {
        break;
      }
    }
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
      .deletePMTruckList(id)
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
      .deletePMTrailerList(id)
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
