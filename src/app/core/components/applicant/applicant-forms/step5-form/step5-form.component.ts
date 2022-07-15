import { Component, Input, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';

import { TruckType } from '../../state/model/truck-type.model';

@Component({
  selector: 'app-step5-form',
  templateUrl: './step5-form.component.html',
  styleUrls: ['./step5-form.component.scss'],
})
export class Step5FormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() truckType: TruckType[];
  @Input() handleInputSelect: (event: any, action: string) => void;

  constructor() {}

  ngOnInit(): void {}
}
