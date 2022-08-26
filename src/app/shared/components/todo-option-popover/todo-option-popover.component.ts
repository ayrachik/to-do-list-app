import { TodoService } from './../../../core/services/todo.service';
import { Todo } from './../../models/todo';
import { Component, Input, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { TodoFormModalComponent } from '../todo-form-modal/todo-form-modal.component';

@Component({
  selector: 'app-todo-option-popover',
  templateUrl: './todo-option-popover.component.html',
  styleUrls: ['./todo-option-popover.component.scss'],
})
export class TodoOptionPopoverComponent implements OnInit {

  @Input() todo: Todo;

  constructor(
    private todoService: TodoService,
    private popoverCrtl: PopoverController,
    private modalCrtl: ModalController,
  ) { }

  ngOnInit() { }

  public openUpdateTodo(todo: Todo): void {
    this.modalCrtl.create({
      component: TodoFormModalComponent,
      componentProps: {
        todo,
        title: 'Modifier un TODO',
        inputLabel: 'Modifier la tâche',
        buttonText: 'SAUVEGARDER'
      },
      id: 'todo-form',
    }).then(el => {
      el.present();
      this.close();
    });
  }

  public deleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo.id).subscribe(_ => this.close());
  }

  public close(): void {
    this.popoverCrtl.dismiss(null, 'cancel', 'todo-option').then();
  }

}
