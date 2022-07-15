import { Component, Input, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step6-form',
  templateUrl: './step6-form.component.html',
  styleUrls: ['./step6-form.component.scss'],
})
export class Step6FormComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
