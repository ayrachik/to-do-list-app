import { TodoOptionPopoverComponent } from './components/todo-option-popover/todo-option-popover.component';
import { TodoFormModalComponent } from './components/todo-form-modal/todo-form-modal.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TodoFormModalComponent,
    TodoOptionPopoverComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ]
})
export class SharedModule { }
