import { PmTService } from './../../../pm-truck-trailer/state/pm.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { convertNumberInThousandSep } from 'src/app/core/utils/methods.calculations';
import { PMTrailerListResponse, PMTruckListResponse } from 'appcoretruckassist';
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
    isChecked: boolean = false,
    svg: string,
    title: string,
    miles: string
  ): FormGroup {
    return this.formBuilder.group({
      isChecked: [isChecked],
      svg: [svg],
      title: [title],
      miles: [miles],
    });
  }

  private createNewPMs(
    isChecked: boolean = false,
    svg: string,
    title: string,
    miles: string,
    value: string,
    hidden: boolean
  ): FormGroup {
    return this.formBuilder.group({
      isChecked: [isChecked],
      svg: [svg],
      title: [title],
      miles: [miles],
      value: [value],
      hidden: [hidden],
    });
  }

  public addPMs(
    data: {
      isChecked: boolean;
      svg: string;
      title: string;
      miles: string;
    },
    event: any
  ) {
    if (event === 'new-pm') {
      this.newPMs.push(
        this.createNewPMs(
          true,
          'assets/svg/common/repair-pm/ic_default_pm.svg',
          '',
          convertNumberInThousandSep(5000),
          null,
          false
        )
      );
    } else {
      this.defaultPMs.push(
        this.createDefaultPMs(data.isChecked, data.svg, data.title, data.miles)
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
    this.newPMs.removeAt(id);
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
                break;
              }
              case 'Trailer': {
                this.addPMTrailerList();
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
                break;
              }
              case 'Trailer': {
                this.addPMTrailerUnit();
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

  private getPMTrailerList() {
    this.pmTService
      .getPMTrailerList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: PMTrailerListResponse) => {
          res.pagination.data.forEach((item) => {
            const data = {
              isChecked: item.status.name === 'Active',
              svg: `assets/svg/common/repair-pm/${item.logoName}`,
              title: item.title,
              miles: convertNumberInThousandSep(item.months),
            };
            this.addPMs(data, null);
          });
        },
        error: () => {
          this.notificationService.error("Can't get trailer PM list.", 'Error');
        },
      });
  }

  private getPMTruckList() {
    this.pmTService
      .getPMTruckList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: PMTruckListResponse) => {
          res.pagination.data.forEach((item) => {
            const data = {
              isChecked: item.status.name === 'Active',
              svg: `assets/svg/common/repair-pm/${item.logoName}`,
              title: item.title,
              miles: convertNumberInThousandSep(item.mileage),
            };
            this.addPMs(data, null);
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
          res.pagination.data.forEach((item) => {
            const data = {
              isChecked: item.status.name === 'Active',
              svg: `assets/svg/common/repair-pm/${item.logoName}`,
              title: item.title,
              miles: convertNumberInThousandSep(item.mileage),
            };
            this.addPMs(data, null);
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

  private getPMTrailerUnit(id: number) {
    this.pmTService
      .getPmTrailerUnitIdModal(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: PMTrailerListResponse) => {
          res.pagination.data.forEach((item) => {
            const data = {
              isChecked: item.status.name === 'Active',
              svg: `assets/svg/common/repair-pm/${item.logoName}`,
              title: item.title,
              miles: convertNumberInThousandSep(item.months),
            };
            this.addPMs(data, null);
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

  private addPMTruckList() {}

  private addPMTrailerList() {}

  private addPMTruckUnit() {}

  private addPMTrailerUnit() {}

  public onChangeValueNewPM(ind: number) {
    this.newPMs
      .at(ind)
      .get('value')
      .valueChanges.pipe(debounceTime(2000), untilDestroyed(this))
      .subscribe((value) => {
        console.log(value);
        if (value) this.newPMs.at(ind).get('hidden').patchValue(true);
      });
  }

  public onMilesMonthChange(ind: number, type: string, oldNew: string) {
    switch (type) {
      case 'Truck': {
        if (oldNew === 'old') {
          this.defaultPMs
            .at(ind)
            .get('miles')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((value) => {
              if (!value || value < 1000) {
                this.defaultPMs
                  .at(ind)
                  .get('miles')
                  .patchValue(convertNumberInThousandSep(1000));
              }
            });
        }

        if (this.newPMs.length && oldNew === 'new') {
          this.newPMs
            .at(ind)
            .get('miles')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((value) => {
              if (!value || value < 1000) {
                this.newPMs
                  .at(ind)
                  .get('miles')
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
            .get('miles')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((value) => {
              if (!value || value == 0) {
                this.defaultPMs
                  .at(ind)
                  .get('miles')
                  .patchValue(convertNumberInThousandSep(1));
              }
            });
        }

        if (this.newPMs.length && oldNew === 'new') {
          this.newPMs
            .at(ind)
            .get('miles')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((value) => {
              if (!value || value == 0) {
                this.newPMs
                  .at(ind)
                  .get('miles')
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

  ngOnDestroy(): void {}
}
