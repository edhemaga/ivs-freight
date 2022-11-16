import { DatePipe } from '@angular/common';
import {
   ChangeDetectorRef,
   Component,
   EventEmitter,
   Input,
   OnInit,
   Output,
} from '@angular/core';
export interface HistoryData {
   id: string;
   startDate: Date | string;
   endDate: Date | string;
   startDateShort?: Date | string;
   endDateShort?: Date | string;
   showStartDateAction?: boolean;
   showEndDateAction?: boolean;
   showDelete?: boolean;
   showDialog?: boolean;
   editStartDate?: boolean;
   editEndDate?: boolean;
   header?: string;
   ownerId?: number;
   dialog?: boolean;
}

export interface GroupItem {
   header: string;
   data: HistoryData[];
}

@Component({
   selector: 'app-history-data',
   templateUrl: './history-data.component.html',
   styleUrls: ['./history-data.component.scss'],
   providers: [DatePipe],
})
export class HistoryDataComponent implements OnInit {
   @Input() data: HistoryData[];
   @Input() status: number;
   @Output() actionEvent: EventEmitter<any> = new EventEmitter();
   @Output() removeEvent: EventEmitter<any> = new EventEmitter();

   @Input() items: GroupItem[] = [];

   // showDialog = false;

   constructor(private datePipe: DatePipe, private cd: ChangeDetectorRef) {}

   ngOnInit(): void {
      this.loadData();
   }

   public loadData(data?: HistoryData[]) {
      if (data) {
         this.data = data;
      }
      this.items = [];
      for (const wd of this.data) {
         wd.dialog = false;
         wd.startDate = wd.startDate ? new Date(wd.startDate) : '';
         wd.endDate = wd.endDate ? new Date(wd.endDate) : '';
         const index = this.items.findIndex((i) => i.header === wd.header);
         if (index !== -1) {
            this.items[index].data.push(wd);
         } else {
            const historyData: HistoryData[] = [];
            historyData.push(wd);
            this.items.push({
               header: wd.header,
               data: historyData,
            });
         }
      }
   }

   saveData(i: number, j: number, isStartDate: boolean): void {
      const index = this.data.findIndex(
         (d) => d.id === this.items[i].data[j].id
      );

      if (index !== -1) {
         this.data[index].startDate = this.items[i].data[j].startDate;
         this.data[index].startDateShort = this.datePipe.transform(
            this.items[i].data[j].startDate,
            'shortDate'
         );
         this.data[index].endDate = this.items[i].data[j].endDate;
         this.data[index].endDateShort = this.datePipe.transform(
            this.items[i].data[j].endDate,
            'shortDate'
         );
      }

      this.actionEvent.emit({
         index,
         isStartDate,
         data: this.data,
      });
   }

   removeData(event: boolean, i: number, j: number): void {
      if (event) {
         const index = this.data.findIndex(
            (d) => d.id === this.items[i].data[j].id
         );
         this.removeEvent.emit(index);
      } else {
         setTimeout(() => {
            this.items.map((d1, key1) => {
               d1.data.map((d2, key2) => {
                  d2.showDialog = false;
                  return d2;
               });
               return d1;
            });
            this.cd.detectChanges();
         }, 0);
      }
   }

   hideDialog(i: number, j: number) {
      this.items.map((d1, key1) => {
         d1.data.map((d2, key2) => {
            d2.showDialog =
               key2 === j && key1 === i
                  ? d2.showDialog
                     ? false
                     : true
                  : false;
            return d2;
         });
         return d1;
      });
      this.cd.detectChanges();
   }

   editStartDate(i: number, j: number) {
      this.items.map((d1, key1) => {
         d1.data.map((d2, key2) => {
            d2.editStartDate = key2 === j && key1 === i ? true : false;
            d2.editEndDate = false;
            return d2;
         });
         return d1;
      });
      this.cd.detectChanges();
   }

   editEndDate(i: number, j: number) {
      this.items.map((d1, key1) => {
         d1.data.map((d2, key2) => {
            d2.editEndDate = key2 === j && key1 === i ? true : false;
            d2.editStartDate = false;
            return d2;
         });
         return d1;
      });
      this.cd.detectChanges();
   }
}
