import {
   ChangeDetectionStrategy,
   Component,
   OnInit,
   ViewEncapsulation,
} from '@angular/core';

import {
   DisplayGrid,
   GridsterConfig,
   GridsterItem,
   GridType,
} from 'angular-gridster2';

@Component({
   selector: 'app-nested',
   templateUrl: './nested.component.html',
   styleUrls: ['./dispatchboard-tables.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
})
export class NestedComponent implements OnInit {
   options: GridsterConfig;
   options2: GridsterConfig;
   dashboard: Array<GridsterItem>;
   dashboard2: Array<GridsterItem>;

   ngOnInit(): void {
      this.options = {
         gridType: GridType.Fit,
         pushDirections: {
            north: true,
            east: false,
            south: false,
            west: false,
         },
         displayGrid: DisplayGrid.Always,
         disableScrollHorizontal: true,
         pushItems: false,
         swap: true,
         swapWhileDragging: false,
         draggable: {
            enabled: true,
         },
         resizable: {
            enabled: false,
         },
      };

      this.options = {
         gridType: GridType.Fit,
         displayGrid: DisplayGrid.Always,
         disableScrollHorizontal: true,
         pushDirections: {
            north: true,
            east: false,
            south: false,
            west: false,
         },
         pushItems: false,
         swap: true,
         swapWhileDragging: false,
         draggable: {
            enabled: true,
         },
         resizable: {
            enabled: false,
         },
      };

      this.dashboard = [
         { cols: 1, rows: 1, y: 0, x: 0 },
         { cols: 1, rows: 1, y: 1, x: 0 },
      ];

      this.dashboard2 = [
         { cols: 1, rows: 1, y: 0, x: 0 },
         { cols: 1, rows: 1, y: 1, x: 0 },
      ];
   }

   changedOptions(): void {
      if (this.options.api && this.options.api.optionsChanged) {
         this.options.api.optionsChanged();
      }
   }

   removeItem($event: MouseEvent | TouchEvent, item): void {
      $event.preventDefault();
      $event.stopPropagation();
      this.dashboard.splice(this.dashboard.indexOf(item), 1);
   }

   addItem(): void {
      this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
   }
}
