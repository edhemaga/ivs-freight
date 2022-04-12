import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { input_dropdown_animation } from './ta-input-dropdown.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-ta-input-dropdown',
  templateUrl: './ta-input-dropdown.component.html',
  styleUrls: ['./ta-input-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [input_dropdown_animation('showHideDropdownOptions')],
})
export class TaInputDropdownComponent implements OnInit, OnDestroy {
  @Input() label: string = 'Dispatcher';
  @Input() canAddNew: boolean = false;
  @Input() options: any[] = [
    { id: 1, name: 'Aleksandar Djordjevic' },
    { id: 2, name: 'Denis Rodman' },
    { id: 3, name: 'James Halpert' },
    { id: 4, name: 'Pamela Beasley' }
  ];

  public searchControl: FormControl = new FormControl(
    null,
    Validators.required
  );
  public activeItem: any;
  public originalOptions: any[] = [];
  public isDropdownOptionsVisible: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.originalOptions = [...this.options];
    this.searchControl.valueChanges
      .pipe(debounceTime(300), untilDestroyed(this))
      .subscribe((term) => this.search(term));
  }

  private search(term: string): void {
    if (term?.length > 0 && !this.activeItem) {
      this.options = this.originalOptions.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );

      if (!this.options.length && !this.canAddNew) {
        this.options.push({
          id: 7654,
          name: 'No Results',
        });
      }

      if (!this.options.length && this.canAddNew) {
        this.options.push({
          id: 7655,
          name: 'Add New',
        });
      }
    } else {
      this.options = this.originalOptions;
    }
  }

  public onActiveItem(option: any) {
    if (option.name === 'No Results') {
      return;
    }
    this.searchControl.setValue(option.name);
    this.activeItem = option;
  }

  public toggleDropdownOptions(action: boolean): void {
    this.isDropdownOptionsVisible = action;
  }

  public onClearSearch(action: boolean): void {
    console.log(action);
    this.options = this.originalOptions;
    this.activeItem = null;
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  // Must be here, because of "untilDestroyed"
  ngOnDestroy(): void {}
}
