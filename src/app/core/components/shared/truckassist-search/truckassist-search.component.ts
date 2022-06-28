import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
  selector: 'app-truckassist-search',
  templateUrl: './truckassist-search.component.html',
  styleUrls: ['./truckassist-search.component.scss'],
})
export class TruckassistSearchComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() selectedTabData: any = {};
  chips: any[] = [];
  openSearch: boolean;
  searchText = '';
  searchIsActive: boolean = false;

  constructor(private tableService: TruckassistTableService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.selectedTabData?.firstChange && changes?.selectedTabData) {
      this.selectedTabData = changes.selectedTabData.currentValue;
    }
  }

  toggleSearch() {
    this.openSearch = !this.openSearch;

    if (this.openSearch && this.chips.length < 3) {
      setTimeout(() => {
        document.getElementById('table-search').focus();
      }, 100);
    }
  }

  onTyping(event: KeyboardEvent) {
    const searchNumber = !this.chips.length
      ? 'searchOne'
      : this.chips.length === 1
      ? 'searchTwo'
      : 'searchThree';

    if (event.key !== 'Enter') {
      if (this.searchText.length >= 3) {
        this.searchIsActive = true;

        this.tableService.sendCurrentSearchTableData({
          chip: searchNumber,
          search: this.searchText,
        });
      } else if (this.searchIsActive && this.searchText.length < 3) {
        this.searchIsActive = false;

        this.tableService.sendCurrentSearchTableData({
          chip: searchNumber,
          doReset: true,
          all: searchNumber === 'searchOne',
        });
      }
    }
  }

  onEnter() {
    if (this.chips.length < 3) {
      this.chips.push({
        searchText: this.searchText,
        color: this.getChipColor(this.chips.length),
        canDoAnimation: true,
      });

      this.searchText = '';
      this.searchIsActive = false;
    }
  }

  onDeleteChip(index: number) {
    this.chips.splice(index, 1);

    this.chips = this.chips.map((chip, i) => {
      chip = {
        searchText: chip.searchText,
        color: this.getChipColor(i),
        canDoAnimation: false,
      };

      return chip;
    });

    if (this.openSearch) {
      setTimeout(() => {
        document.getElementById('table-search').focus();
      }, 100);
    }

    const searchNumber = !this.chips.length
      ? 'searchOne'
      : this.chips.length === 1
      ? 'searchTwo'
      : 'searchThree';

    this.tableService.sendCurrentSearchTableData({
      chip: searchNumber,
      doReset: true,
      all: searchNumber === 'searchOne',
    });
  }

  getChipColor(index: number) {
    const chipsColors = ['#4DB6A2', '#BA68C8', '#FFB74D'];

    return chipsColors[index];
  }

  ngOnDestroy(): void {
    this.tableService.sendCurrentSearchTableData(null);
  }
}
