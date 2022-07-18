import { Component, Input, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';

import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { ReasonForLeaving } from '../../state/model/reason-for-leaving.model';
import { TrailerType } from '../../state/model/trailer-type.model';
import { TruckType } from '../../state/model/truck-type.model';

@Component({
  selector: 'app-step2-form',
  templateUrl: './step2-form.component.html',
  styleUrls: ['./step2-form.component.scss'],
})
export class Step2FormComponent implements OnInit {
  @Input() form: FormGroup;

  @Input() handleInputSelect: (event: any, action: string) => void;

  @Input() questions: ApplicantQuestion[];
  @Input() reasonsForLeaving: ReasonForLeaving[];

  @Input() truckType: TruckType[] = [];
  @Input() trailerType: TrailerType[] = [];
  @Input() trailerLengthType: any[] = [];

  @Input() selectedReasonForLeaving: any;

  constructor() {}

  ngOnInit(): void {}
}
