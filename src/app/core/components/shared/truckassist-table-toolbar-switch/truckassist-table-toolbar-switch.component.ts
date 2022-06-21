import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
  selector: 'app-truckassist-table-toolbar-switch',
  templateUrl: './truckassist-table-toolbar-switch.component.html',
  styleUrls: ['./truckassist-table-toolbar-switch.component.scss'],
})
export class TruckassistTableToolbarSwitchComponent implements OnInit, OnDestroy {
  @Input() switchOptions: any[] = [];

  constructor(private tableService: TruckassistTableService) {}

  ngOnInit(): void {}

  onSelectOption(index: number) {
    if (!this.switchOptions[index].active) {
      this.switchOptions = this.switchOptions.map((option, i) => {
        if (i === index) {
          option.active = true;
        } else {
          option.active = false;
        }

        return option;
      });

      this.tableService.sendCurrentSwitchOptionSelected({
        switchType: 'PM',
        switchDataIndex: index
      })
    }
  }

  ngOnDestroy(): void {
    this.tableService.sendCurrentSwitchOptionSelected(null);
  }
}
