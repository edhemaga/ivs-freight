import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoadResponse } from 'appcoretruckassist';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';

@Component({
  selector: 'app-load-card-view',
  templateUrl: './load-card-view.component.html',
  styleUrls: ['./load-card-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoadCardViewComponent implements OnInit {
  @Input() load: LoadResponse | any;
  @Input() templateCard: boolean;
  public loadNote: FormControl = new FormControl();

  constructor(private imageBase64Service: ImageBase64Service) {}

  ngOnInit(): void {}
}
