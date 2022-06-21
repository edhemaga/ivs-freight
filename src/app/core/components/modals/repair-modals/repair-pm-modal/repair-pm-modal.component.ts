import { PmTService } from './../../../pm-truck-trailer/state/pm.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { convertNumberInThousandSep } from 'src/app/core/utils/methods.calculations';
import { PMTrailerListResponse, PMTruckListResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-repair-pm-modal',
  templateUrl: './repair-pm-modal.component.html',
  styleUrls: ['./repair-pm-modal.component.scss'],
})
export class RepairPmModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;
  public PMform: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private pmTService: PmTService,
    private notificationService: NotificationService
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
    });
  }

  public get defaultPMs(): FormArray {
    return this.PMform.get('defaultPMs') as FormArray;
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

  public addPMs(data: {
    isChecked: boolean;
    svg: string;
    title: string;
    miles: string;
  }) {
    if (event) {
      this.defaultPMs.push(
        this.createDefaultPMs(data.isChecked, data.svg, data.title, data.miles)
      );
    }
  }

  // public removePMs(id: number) {
  //   this.PMs.removeAt(id);
  // }

  public onModalAction(data: { action: string; bool: boolean }) {}

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
            this.addPMs(data);
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
            this.addPMs(data);
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
          console.log(res);
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
          console.log(res);
        },
        error: () => {
          this.notificationService.error(
            `Can't load Trailer Unit By ${id}`,
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

  ngOnDestroy(): void {}
}
