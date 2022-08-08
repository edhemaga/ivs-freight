import { Component, Input, OnInit } from '@angular/core';

import { FormGroup, FormControl, Form } from '@angular/forms';

import { TruckType } from '../../state/model/truck-type.model';
import { AnswerChoices } from '../../state/model/applicant-question.model';
import { AddressEntity } from 'appcoretruckassist';

@Component({
  selector: 'app-step4-form',
  templateUrl: './step4-form.component.html',
  styleUrls: ['./step4-form.component.scss'],
})
export class Step4FormComponent implements OnInit {
  @Input() form: FormGroup;

  @Input() handleInputSelect: (event: any, action: string) => void;
  @Input() onIncrementDecrementCounter: (event: any, type: string) => void;

  @Input() truckType: TruckType[];

  @Input() fatalitiesCounter: number;
  @Input() injuriesCounter: number;

  @Input() answerChoices: AnswerChoices[];

  public fatalitiesControl: FormControl = new FormControl(0);
  public injuriesControl: FormControl = new FormControl(0);

  public selectedAddress: AddressEntity;

  constructor() {}

  ngOnInit(): void {}
}
