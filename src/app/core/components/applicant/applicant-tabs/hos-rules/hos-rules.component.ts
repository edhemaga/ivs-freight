import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-hos-rules',
  templateUrl: './hos-rules.component.html',
  styleUrls: ['./hos-rules.component.scss'],
})
export class HosRulesComponent implements OnInit {
  public selectedMode: string = SelectedMode.FEEDBACK;

  public hosRulesForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.hosRulesForm = this.formBuilder.group({
      isReadingConfirmed: [false],
    });
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
    }
  }
}
