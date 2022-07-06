import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ta-input-arrows',
  templateUrl: './ta-input-arrows.component.html',
  styleUrls: ['./ta-input-arrows.component.scss'],
})
export class TaInputArrowsComponent implements OnInit {
  @Input() formControlName: string;

  constructor() {}

  ngOnInit(): void {}
}
