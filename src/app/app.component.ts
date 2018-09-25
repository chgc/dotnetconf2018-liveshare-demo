import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Todo } from './model/todo';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';
import { Action, TodoActions } from './todo-actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChildren('edit')
  edits: QueryList<ElementRef>;

  filter = '';

  dispatch$ = new Subject<Action>();
  todos$: Observable<Todo[]> = this.dispatch$.pipe(
    scan<Action, Todo[]>(
      (acc, value) => TodoActions[value.action](acc, value),
      []
    ),
    shareReplay()
  );

  todoCount$ = this.todos$.pipe(map(todos => todos.length));
  itemLeft$ = this.todos$.pipe(
    map(todos => todos.filter(todo => !todo.isCompleted).length)
  );

  constructor(route: ActivatedRoute) {
    route.fragment.subscribe(fragment => {
      this.filter = (fragment || '/').replace('/', '');
    });
  }

  addTodo(newTodo) {
    if (!newTodo.value) {
      return;
    }
    this.dispatch$.next(new Action('Add', Todo.create(newTodo.value)));
    newTodo.value = '';
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
    this.setInputFocus(target);
  }

  private setInputFocus(target: HTMLInputElement) {
    setTimeout(() => {
      const edit = this.edits.filter(
        ele => ele.nativeElement.id === target.id
      )[0];
      edit.nativeElement.focus();
    }, 0);
  }
}
