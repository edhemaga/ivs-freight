import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppNoteComponent } from './app-note.component';
@NgModule({
  declarations: [
    AppNoteComponent,
  ],
  exports: [
    AppNoteComponent
  ],
  imports: [
      CommonModule
  ]
})
export class AppNoteModule { }