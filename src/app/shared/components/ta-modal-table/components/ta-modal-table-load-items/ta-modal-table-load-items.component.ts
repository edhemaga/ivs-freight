import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-ta-modal-table-load-items',
  templateUrl: './ta-modal-table-load-items.component.html',
  styleUrls: ['./ta-modal-table-load-items.component.scss'],
  standalone: true,
  imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

  ]
})
export class TaModalTableLoadItemsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
