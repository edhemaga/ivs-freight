import { Component, Input, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step3-form',
  templateUrl: './step3-form.component.html',
  styleUrls: ['./step3-form.component.scss'],
})
export class Step3FormComponent implements OnInit {
  @Input() form: FormGroup;

  @Input() handleInputSelect: (event: any, action: string) => void;

  @Input() countryTypes: any[] = [];
  @Input() stateTypes: any[] = [];
  @Input() classTypes: any[] = [];
  @Input() endorsmentsList: any[] = [];
  @Input() restrictionsList: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
