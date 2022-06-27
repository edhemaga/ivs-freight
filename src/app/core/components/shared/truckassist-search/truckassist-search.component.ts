import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-truckassist-search',
  templateUrl: './truckassist-search.component.html',
  styleUrls: ['./truckassist-search.component.scss'],
})
export class TruckassistSearchComponent implements OnInit, OnChanges {
  @Input() selectedTabData: any = {};
  openSearch: boolean;
  searchText: string = '';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.selectedTabData?.firstChange && changes?.selectedTabData) {
      this.selectedTabData = changes.selectedTabData.currentValue;
    }
  }

  onTyping() {}
}
