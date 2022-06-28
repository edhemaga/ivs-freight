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
    if (this.chips.length < 3) {
      this.openSearch = !this.openSearch;

      if (this.openSearch) {
        setTimeout(() => {
          document.getElementById('table-search').focus();
        }, 100);
      }
    }
  }

  onTyping() {
     /* if (this.searchText.length >= 3) {
      this.searchIsActive = true;

      this.tableService.sendCurrentSearchTableData({
        isChipsSet: false,
        searchText: this.searchText,
      });

    } else if (this.searchIsActive && this.searchText.length < 3) {
      this.searchIsActive = false;

      this.tableService.sendCurrentSearchTableData({
        reset: true,
      });
    } */
  }

  onEnter() {
    if (this.chips.length < 3) {
      this.chips.push({
        chipId: this.chips.length + 1,
        searchText: this.searchText,
        color: this.getChipColor(this.chips.length + 1),
        position: -63
      });

      this.searchText = '';

      /* if(this.chips.length >= 3){
        this.openSearch = false;
      } */

      // Treba da se ukloni posle
      this.tableService.sendCurrentSearchTableData({
        reset: true,
      });
    }
  }

  getChipColor(id: number) {
    const chipsColors = [
      {
        id: 1,
        color: '#4DB6A2',
      },
      {
        id: 2,
        color: '#BA68C8',
      },
      {
        id: 3,
        color: '#FFB74D',
      },
    ];

    let color: any = {};

    chipsColors.filter((chipColor) => {
      if (id === chipColor.id) {
        color = chipColor.color;
      }
    });

    return color;
  }

  ngOnDestroy(): void {
    this.tableService.sendCurrentSearchTableData(null);
  }
}
