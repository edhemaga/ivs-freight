import { BrokerDetailsQuery } from './../state/broker-details-state/broker-details.query';
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
import { BrokerQuery } from '../state/broker-state/broker.query';

@Component({
  selector: 'app-broker-card-view',
  templateUrl: './broker-card-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./broker-card-view.component.scss'],
})
export class BrokerCardViewComponent implements OnInit, OnChanges {
  @Input() broker: any;
  @Input() templateCard: boolean;
  public brokerDropdowns: any[] = [];
  public brokerList: any[] = this.brokerQuery.getAll();
  public note: FormControl = new FormControl();
  public tabsBroker: any;
  constructor(
    private brokerQuery: BrokerQuery,
    private brokerDetailsQuery: BrokerDetailsQuery,
    private detailsPageDriverSer: DetailsPageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.broker?.firstChange && changes?.broker) {
      this.note.patchValue(changes.broker.currentValue.note);
      this.getBrokerDropdown();
    }
  }
  ngOnInit(): void {
    this.note.patchValue(this.broker.note);
    this.getBrokerDropdown();
    this.tabsButton();
    console.log(this.brokerDetailsQuery.getAll());
  }

  public tabsButton() {
    this.tabsBroker = [
      {
        id: 223,
        name: '1M',
      },
      {
        name: '3M',
        checked: false,
      },
      {
        id: 412,
        name: '6M',
        checked: false,
      },
      {
        id: 515,
        name: '1Y',
        checked: false,
      },
      {
        id: 1210,
        name: 'YTD',
        checked: false,
      },
      {
        id: 1011,
        name: 'ALL',
        checked: false,
      },
    ];
  }
  public getBrokerDropdown() {
    this.brokerDropdowns = this.brokerQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.businessName,
        active: item.id === this.broker.id,
      };
    });
  }
  public onSelectBroker(event: any) {
    if (event.id !== this.broker.id) {
      this.brokerList = this.brokerQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.businessName,
          active: item.id === event.id,
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }

  public onChangeBroker(action: string) {
    let currentIndex = this.brokerList.findIndex(
      (brokerId) => brokerId.id === this.broker.id
    );

    switch (action) {
      case 'previous': {
        currentIndex = --currentIndex;
        if (currentIndex != -1) {
          this.detailsPageDriverSer.getDataDetailId(
            this.brokerList[currentIndex].id
          );
          this.onSelectBroker({ id: this.brokerList[currentIndex].id });
        }
        break;
      }
      case 'next': {
        currentIndex = ++currentIndex;
        if (currentIndex !== -1 && this.brokerList.length > currentIndex) {
          this.detailsPageDriverSer.getDataDetailId(
            this.brokerList[currentIndex].id
          );
          this.onSelectBroker({ id: this.brokerList[currentIndex].id });
        }
        break;
      }
      default: {
        break;
      }
    }
  }
}
