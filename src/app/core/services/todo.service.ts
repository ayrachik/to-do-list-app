/* eslint-disable @typescript-eslint/member-ordering */
import { SuccessStatus, TodoDto } from './../../shared/models/todo';
import { DateHelper } from './../../shared/utils/date-helper';
import { map, tap } from 'rxjs/operators';
import { Todo, TodoPageDto, TodosByMonth } from './../../shared/models/todo';
import { environment } from './../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoPage } from 'src/app/shared/models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: BehaviorSubject<Todo[]> = new BehaviorSubject([]);
  public readonly todos$: Observable<Todo[]> = this.todos.asObservable();

  constructor(
    private http: HttpClient,
    private dateHelper: DateHelper
  ) { }

  public getTodos(pageNumber = 1, search?: string): Observable<TodoPage> {
    const url = `${environment.api}/todos?page=${pageNumber}${!!search ? '&search=' + search : ''}`;

    return this.http.get<TodoPageDto>(url)
      .pipe(
        map(todoPageDto => (
          {
            count: todoPageDto.count,
            rows: todoPageDto.rows.map(todoDto => new Todo(todoDto))
          } as TodoPage
        )
        ),
        tap(page => this.insertTodos(page?.rows ?? [])),
      );
  }

  public createTodo(label: string): Observable<Todo> {
    const url = `${environment.api}/todo`;

    return this.http.post<{ success: boolean; result: TodoDto }>(url, { label })
      .pipe(
        map(response => new Todo(response.result)),
        tap(todo => this.insertTodos([todo]))
      );
  }

  public deleteTodo(id: string): Observable<SuccessStatus> {
    const url = `${environment.api}/todo/${id}`;

    return this.http.delete<SuccessStatus>(url)
      .pipe(
        tap(_ => this.deleteTodoLocally(id))
      );
  }

  public updateTodo(id: string, label: string, done: boolean): Observable<SuccessStatus> {
    const url = `${environment.api}/todo/${id}`;

    return this.http.put<SuccessStatus>(url, { label, done })
      .pipe(
        tap(_ => this.replaceTodoLocally({ id, label, done }))
      );
  }

  public setTodos(todos: Todo[]): void {
    this.todos.next(todos);
  }

  public resetTodos(): void {
    this.todos.next([]);
  }

  public groupTodoByMonth(sortedTodos: Todo[]): TodosByMonth[] {
    const todosByMonth: TodosByMonth[] = [];

    sortedTodos.forEach(todo => {
      const currentTodoByMonth = !!todosByMonth.length ? todosByMonth[todosByMonth.length - 1] : { month: todo.createdAt, todos: [] };
      if (this.dateHelper.areSameMonths(currentTodoByMonth.month, todo.createdAt)) {
        currentTodoByMonth.todos.push(todo);
        if (todosByMonth.length) {
          todosByMonth[todosByMonth.length - 1] = currentTodoByMonth;
        } else {
          todosByMonth.push(currentTodoByMonth);
        }
      } else {
        todosByMonth[todosByMonth.length - 1] = currentTodoByMonth;
        todosByMonth.push({ month: todo.createdAt, todos: [todo] });
      }
    });

    return todosByMonth;
  }

  private replaceTodoLocally(todo: Partial<Todo>): void {
    const todos = [...this.todos.value];
    const index = todos.findIndex(el => el.id === todo.id);
    todos[index] = { ...todos[index], ...todo };
    this.todos.next(todos);
  }

  private insertTodos(todos: Todo[]): void {
    this.todos.next([...this.todos.value, ...todos].sort((todo1, todo2) => todo1.createdAt.getTime() - todo2.createdAt.getTime()));
  }

  private deleteTodoLocally(id: string): void {
    this.todos.next([...this.todos.value].filter(todo => todo.id !== id));
  }

}
