import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { RoadsideActiveQuery } from '../state/roadside-state/roadside-active/roadside-active.query';
import { RoadsideInspectionResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-violation-card-view',
  templateUrl: './violation-card-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./violation-card-view.component.scss'],
})
export class ViolationCardViewComponent implements OnInit, OnChanges {
  @Input() public violationCardData: any;
  @Input() public templateCard: boolean;
  public violationDropdown: any;
  public noteControl: FormControl = new FormControl();
  public dummyDataSpecial: any;
  public violationList: any[] = this.violationActiveQuery.getAll();
  public specialChecksCounter: number = 0;
  constructor(
    private violationActiveQuery: RoadsideActiveQuery,
    private detailsPageDriverSer: DetailsPageService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.countSpecialChecks(changes?.violationCardData?.currentValue);
    this.getViolationDropdown();
  }
  ngOnInit(): void {
    this.noteControl.patchValue(
      'How to pursue pleasure rationally encounter consequences that are extremely painful.'
    );
  }

  public countSpecialChecks(violDate: RoadsideInspectionResponse) {
    this.specialChecksCounter = 0;
    if (violDate?.alcContSubCheck) {
      this.specialChecksCounter++;
    }
    if (violDate?.condByLocalJuris) {
      this.specialChecksCounter++;
    }
    if (violDate?.sizeAndWeightEnf) {
      this.specialChecksCounter++;
    }
    if (violDate?.eScreenInspection) {
      this.specialChecksCounter++;
    }
    if (violDate?.trafficEnforcment) {
      this.specialChecksCounter++;
    }
    if (violDate?.pasaConditionInsp) {
      this.specialChecksCounter++;
    }
    if (violDate?.drugInterdSearch) {
      this.specialChecksCounter++;
    }
    if (violDate?.borderEnfInspection) {
      this.specialChecksCounter++;
    }
    if (violDate?.postCrashInspection) {
      this.specialChecksCounter++;
    }
    if (violDate?.pbbtInspection) {
      this.specialChecksCounter++;
    }
  }

  public getViolationDropdown() {
    this.violationDropdown = this.violationActiveQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.report,
        active: item.id === this.violationCardData.id,
      };
    });
  }

  public onSelectViolation(event: any) {
    if (event.id !== this.violationCardData.id) {
      this.violationList = this.violationActiveQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.report,
          active: item.id === event.id,
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }

  public onChangeViolation(action: string) {
    let currentIndex = this.violationList.findIndex(
      (violationId) => violationId.id === this.violationCardData.id
    );

    switch (action) {
      case 'previous': {
        currentIndex = --currentIndex;
        if (currentIndex != -1) {
          this.detailsPageDriverSer.getDataDetailId(
            this.violationList[currentIndex].id
          );
          this.onSelectViolation({ id: this.violationList[currentIndex].id });
        }
        break;
      }
      case 'next': {
        currentIndex = ++currentIndex;
        if (currentIndex !== -1 && this.violationList.length > currentIndex) {
          this.detailsPageDriverSer.getDataDetailId(
            this.violationList[currentIndex].id
          );
          this.onSelectViolation({ id: this.violationList[currentIndex].id });
        }
        break;
      }

      default: {
        break;
      }
    }
  }
}
