import { Todo } from './../../models/todo';
import { ModalController } from '@ionic/angular';
import { TodoService } from '../../../core/services/todo.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-form-modal',
  templateUrl: './todo-form-modal.component.html',
  styleUrls: ['./todo-form-modal.component.scss'],
})
export class TodoFormModalComponent implements OnInit {

  @Input() todo?: Todo;
  @Input() title = 'Ajouter un TODO';
  @Input() inputLabel = 'Ajouter une nouvelle tâche à réaliser.';
  @Input() buttonText?= 'ENREGISTRER';
  public todoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private modalCrtl: ModalController,
  ) { }

  get label(): FormControl { return this.todoForm.get('label') as FormControl; }

  ngOnInit() {
    this.initForm();
  }

  public close(): void {
    this.modalCrtl.dismiss(null, 'cancel', 'todo-form');
  }

  public submit(): void {
    if (this.todoForm.invalid) {
      return;
    }

    if (this.todo) {
      this.todoService.updateTodo(this.todo.id, this.label.value, this.todo.done).subscribe(
        todo => this.modalCrtl.dismiss(todo, 'update', 'todo-form')
      );
    } else {
      this.todoService.createTodo(this.label.value).subscribe(
        todo => this.modalCrtl.dismiss(todo, 'create', 'todo-form')
      );
    }

  }

  private initForm(): void {
    this.todoForm = this.fb.group({
      label: [this.todo?.label ?? '', [Validators.required]]
    });
  }

}
