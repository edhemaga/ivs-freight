import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { GOOGLE_MAP_STYLES, NORTH_AMERICA_BOUNDS } from 'src/app/const';
import {PayrollService} from '../payroll.service';

@Component({
  selector: 'app-payroll-summary',
  templateUrl: './payroll-summary.component.html',
  styleUrls: ['./payroll-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollSummaryComponent implements OnInit {

  data: any[] = [
    {
      pointType: "delivery",
      isLast: true,
      location: "Morton, MS 65005",
      pointCount: "3",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 1,
      pointType: "pickup",
      location: "Morton, MS 65005",
      pointCount: "1",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 1,
      pointType: "pickup",
      location: "Morton, MS 65005",
      pointCount: "2",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 1,
      pointType: "delivery",
      location: "Morton, MS 65005",
      pointCount: "1",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 1,
      pointType: "delivery",
      location: "Morton, MS 65005",
      pointCount: "2",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 1,
      pointType: "delivery",
      location: "Morton, MS 65005",
      pointCount: "3",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 1,
      pointType: "repair",
      location: "Morton, MS 65005",
      pointCount: "R",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 1,
      pointType: "delivery",
      location: "Morton, MS 65005",
      pointCount: "4",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 2,
      pointType: "dead-heading",
      location: "Morton, MS 65005",
      pointCount: "D",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 3,
      pointType: "pickup",
      location: "Morton, MS 65005",
      pointCount: "1",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      id: 3,
      pointType: "delivery",
      location: "Morton, MS 65005",
      pointCount: "1",
      data: "05/09/21",
      time: "10:37 PM",
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    },
    {
      isDraggable: true,
      leg: "0.0",
      loaded: "0.0",
      empty: "0.0",
      miles: "0.0",
      subototal: "0.0"
    }
  ];
  public styles = GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  prevIndex: number;
  startIndexId: number;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public payrollService: PayrollService) {
  }

  // USE ARROW FUNCTION NOTATION TO ACCESS COMPONENT "THIS"
  containerPredictPosition = (index: number) => {

    if (index == 0) return false;
    else if (!this.prevIndex) {
      this.prevIndex = index;
      return false;
    } else if (index + 1 >= this.data.length) {
      return true;
    } else if (index < this.prevIndex && this.data[index].id == this.data[index - 1].id) {
      return false
    } else if (index > this.prevIndex && this.data[index].id == this.data[index + 1].id) {
      return false;
    }

    this.prevIndex = index;
    return true;

    //return index !== 0 && ( this.data[index].id !== this.data[index - 1].id ?? this.data[index].id !== this.data[index + 1].id );
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex == 0) {
      event.currentIndex = 1;
    }

    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    // const newData = tableDetails.slice(1, event.currentIndex);
    // const calc_data = this.calculateTotalItems(newData);
    // Object.assign(tableDetails[event.currentIndex], calc_data);
  }

  cdkDragStarted() {
    // console.log("STAR");
    // console.log(this.data[rowIndex]);
    // this.startIndexId = this.data[rowIndex-1].id;
  }

  ngOnInit(): void {
    this.payrollService.toggleTables
      .pipe(takeUntil(this.destroy$))
      .subscribe((type: boolean) => {
        console.log(type);
      });
  }

  onDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
