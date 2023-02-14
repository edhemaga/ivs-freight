import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import svgList from 'src/assets/svg/image-list.json';

@Component({
    selector: 'app-svg-definitions',
    templateUrl: './svg-definitions.component.html',
    styleUrls: ['./svg-definitions.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class SvgDefinitionsComponent implements OnInit {
    imageList: any[] = svgList;
    constructor() {}

    ngOnInit(): void {}
}
