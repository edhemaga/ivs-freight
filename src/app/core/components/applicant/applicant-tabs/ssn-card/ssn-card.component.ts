import { Component, OnInit } from '@angular/core';

import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-ssn-card',
  templateUrl: './ssn-card.component.html',
  styleUrls: ['./ssn-card.component.scss'],
})
export class SsnCardComponent implements OnInit {
  public selectedMode: string = SelectedMode.APPLICANT;

  constructor() {}

  ngOnInit(): void {}
}
