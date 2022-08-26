export interface TodoDto {
  readonly id: string;
  label: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Todo {
  readonly id: string;
  label: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(todo: TodoDto) {
    this.id = todo.id;
    this.label = todo.label;
    this.done = todo.done;
    this.createdAt = new Date(Date.parse(todo.createdAt));
    this.updatedAt = new Date(Date.parse(todo.updatedAt));
  }
}

export interface TodosByMonth {
  month: Date;
  todos: Todo[];
}

export interface TodoPage {
  rows: Todo[];
  count: number;
}

export interface TodoPageDto {
  rows: TodoDto[];
  count: number;
}

export interface SuccessStatus {
  success: boolean;
}
