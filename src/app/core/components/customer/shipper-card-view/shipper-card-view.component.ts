import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShipperResponse } from 'appcoretruckassist';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { ShipperQuery } from '../state/shipper-state/shipper.query';

@Component({
  selector: 'app-shipper-card-view',
  templateUrl: './shipper-card-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./shipper-card-view.component.scss'],
})
export class ShipperCardViewComponent implements OnInit, OnChanges {
  @Input() shipper: any;
  @Input() templateCard: boolean;
  public shipperDropdowns: any[] = [];
  public shipperList: any[] = this.shipperQuery.getAll();
  public note: FormControl = new FormControl();
  constructor(
    private shipperQuery: ShipperQuery,
    private detailsPageDriverSer: DetailsPageService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.shipper?.firstChange && changes?.shipper) {
      this.note.patchValue(this.shipper.note);
      this.shipper = changes.shipper.currentValue;
      this.getShipperDropdown();
    }
  }
  ngOnInit(): void {
    this.getShipperDropdown();
    this.note.patchValue(this.shipper.note);
  }
  public getShipperDropdown() {
    this.shipperDropdowns = this.shipperQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.businessName,
        active: item.id === this.shipper.id,
      };
    });
  }

  public onSelectedShipper(event: any) {
    if (event.id !== this.shipper.id) {
      this.shipperList = this.shipperQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.businessName,
          active: item.id === event.id,
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }

  public onChangeShipper(action: string) {
    let currentIndex = this.shipperList.findIndex(
      (shipper) => shipper.id === this.shipper.id
    );
 
    switch (action) {
      case 'previous': {
        currentIndex = --currentIndex;
        if (currentIndex != -1) {
          this.detailsPageDriverSer.getDataDetailId(
            this.shipperList[currentIndex].id
          );
          this.onSelectedShipper({ id: this.shipperList[currentIndex].id });
        }
        break;
      }
      case 'next': {
        currentIndex = ++currentIndex;
        if (currentIndex !== -1 && this.shipperList.length > currentIndex) {
          this.detailsPageDriverSer.getDataDetailId(
            this.shipperList[currentIndex].id
          );
          this.onSelectedShipper({ id: this.shipperList[currentIndex].id });
        }
        break;
      }
      default: {
        break;
      }
    }
    
  }
}
