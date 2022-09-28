import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { RoadsideActiveQuery } from '../state/roadside-state/roadside-active/roadside-active.query';

@Component({
  selector: 'app-violation-card-view',
  templateUrl: './violation-card-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./violation-card-view.component.scss'],
})
export class ViolationCardViewComponent implements OnInit {
  @Input() public violationCardData: any;
  @Input() public templateCard: boolean;
  public violationDropdown: any;
  public noteControl: FormControl = new FormControl();
  public dummyDataSpecial: any;
  public violationList: any[] = this.violationActiveQuery.getAll();
  constructor(
    private violationActiveQuery: RoadsideActiveQuery,
    private detailsPageDriverSer: DetailsPageService
  ) {}

  ngOnInit(): void {
    this.noteControl.patchValue(
      'How to pursue pleasure rationally encounter consequences that are extremely painful.'
    );
    this.getViolationDropdown();
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
        console.log(item);

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
