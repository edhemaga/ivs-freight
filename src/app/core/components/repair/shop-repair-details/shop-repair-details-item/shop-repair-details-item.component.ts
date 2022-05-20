import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop-repair-details-item',
  templateUrl: './shop-repair-details-item.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./shop-repair-details-item.component.scss']
})
export class ShopRepairDetailsItemComponent implements OnInit {
  @Input() data: any = null;
  public noteControl: FormControl = new FormControl();
  public shopData:any;
  constructor(
    private _act_route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.shopData=this._act_route.snapshot.data;
    this.noteControl.patchValue('Neki notee');
  }

  public formatPhone(phoneNumberString: string) {
    const value = phoneNumberString;
    const number = value?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    phoneNumberString = number;
    return number;
  }

}
