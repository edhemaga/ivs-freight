import { Component, OnInit } from '@angular/core';

// @ts-ignore
import AppImages from '../../../../../assets/img/images.json';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  appImages: any = AppImages;

  constructor() {}

  ngOnInit(): void {}
}
