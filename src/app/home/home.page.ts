import { TodoOptionPopoverComponent } from './../shared/components/todo-option-popover/todo-option-popover.component';
import { TodoFormModalComponent } from '../shared/components/todo-form-modal/todo-form-modal.component';
import { map } from 'rxjs/operators';
import { Todo, TodosByMonth } from './../shared/models/todo';
import { Observable } from 'rxjs';
import { TodoService } from './../core/services/todo.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public todos$: Observable<Todo[]>;
  public todosByMonths$: Observable<TodosByMonth[]>;
  public search = '';
  private pageNumber = 1;

  constructor(
    private todoService: TodoService,
    private modalCrtl: ModalController,
    private popoverCrtl: PopoverController,
  ) { }

  ngOnInit(): void {
    this.refreshTodos();
    this.todos$ = this.todoService.todos$;
    this.todosByMonths$ = this.todoService.todos$.pipe(
      map(todos => this.todoService.groupTodoByMonth(todos))
    );
  }

  public refreshTodos(event?: any): void {
    this.todoService.getTodos(this.pageNumber, this.search).subscribe(_ => {
      if (event) {
        event.target.complete();
      }
      this.pageNumber++;
    });
  }

  public triggerSearch(event: any): void {
    event.preventDefault();
    this.pageNumber = 1;
    this.todoService.resetTodos();
    this.refreshTodos();
  }

  public openModal(): void {
    this.modalCrtl.create({
      component: TodoFormModalComponent,
      id: 'todo-form'
    }).then(el => el.present());
  }

  public openPoover(todo: Todo): void {
    this.popoverCrtl.create({
      component: TodoOptionPopoverComponent,
      componentProps: { todo },
      id: 'todo-option'
    }).then(el => el.present());
  }


  public toggleDone(todo: Todo): void {
    this.todoService.updateTodo(todo.id, todo.label, !todo.done).subscribe();
  }

}
