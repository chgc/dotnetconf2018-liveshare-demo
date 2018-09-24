import { Component } from '@angular/core';
import { Todo } from './model/todo';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';

type ActionType =
  | 'Add'
  | 'Update'
  | 'Delete'
  | 'MarkAllComplete'
  | 'clearComplete'
  | 'CancelAllEdit';
export class Action {
  constructor(public action: ActionType, public todo?: Todo) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newTodo = '';

  dispatch$ = new Subject<Action>();
  todos$: Observable<Todo[]> = this.dispatch$.pipe(
    scan((acc: Todo[], value: Action) => {
      switch (value.action) {
        case 'Add':
          const maxId =
            (acc
              .slice()
              .sort((a, b) => b.id - a.id)
              .map(todo => todo.id)[0] || 0) + 1;
          return [...acc, new Todo(maxId, value.todo.content)];
        case 'Update':
          return acc.map(todo => {
            if (todo.id === value.todo.id) {
              todo = value.todo;
            }
            return todo;
          });
        case 'Delete':
          return acc.filter(todo => todo.id !== value.todo.id);
        case 'CancelAllEdit':
          return acc.map(
            _todo => new Todo(_todo.id, _todo.content, _todo.isCompleted, false)
          );
        case 'clearComplete':
          return acc.filter(todo => !todo.isCompleted);
        case 'MarkAllComplete':
          return acc.map(
            todo => new Todo(todo.id, todo.content, true, todo.isEdit)
          );
      }
      return acc;
    }, []),
    shareReplay()
  );
  filter = '';
  constructor(private route: ActivatedRoute) {
    route.fragment.subscribe(fragment => {
      this.filter = (fragment || '/').replace('/', '');
    });
  }
  itemLeft$ = this.todos$.pipe(
    map(todos => todos.filter(todo => !todo.isCompleted).length)
  );

  todoCount$ = this.todos$.pipe(map(todos => todos.length));

  addTodo() {
    this.dispatch$.next(new Action('Add', Todo.create(this.newTodo)));
    this.newTodo = '';
  }

  toggleComplete(todo: Todo) {
    this.dispatch$.next(new Action('Update', todo.toggleComplete()));
  }

  removeTodo(todo: Todo) {
    this.dispatch$.next(new Action('Delete', todo));
  }

  markAllComplete() {
    this.dispatch$.next(new Action('MarkAllComplete'));
  }

  clearComplete() {
    this.dispatch$.next(new Action('clearComplete'));
  }

  enterEdit(todo: Todo, target: HTMLInputElement) {
    if (todo.isCompleted) {
      return;
    }
    this.dispatch$.next(new Action('CancelAllEdit'));
    this.dispatch$.next(new Action('Update', todo.toggleEdit()));
    target.focus();
  }

  updateContent(content, todo) {
    this.dispatch$.next(new Action('Update', todo.updateContent(content)));
  }

  cancelUpdate(todo: Todo) {
    this.dispatch$.next(new Action('Update', todo.toggleEdit()));
  }
}
