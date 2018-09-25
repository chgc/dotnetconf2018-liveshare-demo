import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Todo } from './model/todo';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';

type ActionType =
  | 'Add'
  | 'Update'
  | 'Delete'
  | 'MarkAllComplete'
  | 'ClearComplete'
  | 'CancelAllEdit';
export class Action {
  constructor(public action: ActionType, public todo?: Todo) {}
}

export const TodoActions = {
  Add: (acc, value) => {
    const maxId = acc.reduce((a, b) => Math.max(a, b.id), 0) + 1;
    return [...acc, new Todo(maxId, value.todo.content)];
  },
  Update: (acc, value) =>
    acc.map(todo => {
      if (todo.id === value.todo.id) {
        todo = value.todo;
      }
      return todo;
    }),
  Delete: (acc, value) => acc.filter(todo => todo.id !== value.todo.id),
  CancelAllEdit: (acc, value) =>
    acc.map(
      _todo => new Todo(_todo.id, _todo.content, _todo.isCompleted, false)
    ),
  ClearComplete: (acc, value) => acc.filter(todo => !todo.isCompleted),
  MarkAllComplete: (acc, value) =>
    acc.map(todo => new Todo(todo.id, todo.content, true, todo.isEdit))
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChildren('edit')
  edits: QueryList<ElementRef>;

  newTodo = '';
  filter = '';

  dispatch$ = new Subject<Action>();
  todos$: Observable<Todo[]> = this.dispatch$.pipe(
    scan(
      (acc: Todo[], value: Action) => TodoActions[value.action](acc, value),
      []
    ),
    shareReplay()
  );

  constructor(private route: ActivatedRoute) {
    route.fragment.subscribe(fragment => {
      this.filter = (fragment || '/').replace('/', '');
    });
  }
  todoCount$ = this.todos$.pipe(map(todos => todos.length));
  itemLeft$ = this.todos$.pipe(
    map(todos => todos.filter(todo => !todo.isCompleted).length)
  );

  addTodo() {
    this.dispatch$.next(new Action('Add', Todo.create(this.newTodo)));
    this.newTodo = '';
  }

  toggleComplete = (todo: Todo) =>
    this.dispatch$.next(new Action('Update', todo.toggleComplete()));

  removeTodo = (todo: Todo) => this.dispatch$.next(new Action('Delete', todo));

  markAllComplete = () => this.dispatch$.next(new Action('MarkAllComplete'));

  clearComplete = () => this.dispatch$.next(new Action('ClearComplete'));

  updateContent = (content, todo) =>
    this.dispatch$.next(new Action('Update', todo.updateContent(content)));

  cancelUpdate = (todo: Todo) =>
    this.dispatch$.next(new Action('Update', todo.toggleEdit()));

  enterEdit(todo: Todo, target: HTMLInputElement) {
    if (todo.isCompleted) {
      return;
    }
    this.dispatch$.next(new Action('CancelAllEdit'));
    this.dispatch$.next(new Action('Update', todo.toggleEdit()));
    setTimeout(() => {
      const edit = this.edits.filter(
        ele => ele.nativeElement.id === target.id
      )[0];
      edit.nativeElement.focus();
    }, 0);
  }
}
