import { Component, Input, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';

import { TruckType } from '../../state/model/truck-type.model';
import { AnswerChoices } from '../../state/model/applicant-question.model';

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

  constructor() {}

  ngOnInit(): void {}
}
