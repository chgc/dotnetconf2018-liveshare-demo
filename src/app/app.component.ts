import { Component } from '@angular/core';
import { Todo } from './model/todo';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo';
  newTodo = '';
  todos: Todo[] = [];
  filter = '';
  constructor(private route: ActivatedRoute) {
    route.fragment.subscribe(fragment => {
      this.filter = (fragment || '/').replace('/', '');
    });
  }
  get itemLeft() {
    return this.todos.filter(todo => !todo.isCompleted).length;
  }

  addTodo() {
    this.todos.push(new Todo(this.newTodo));
    this.newTodo = '';
  }

  toggleComplete(todo: Todo, idx) {
    this.refreshTodoList(idx, todo.toggleComplete());
  }

  removeTodo(idx) {
    this.refreshTodoList(idx);
  }

  markAllComplete() {
    this.todos = this.todos.map(todo => new Todo(todo.content, true));
  }

  clearComplete() {
    this.todos = this.todos.filter(todo => !todo.isCompleted);
  }

  enterEdit(todo: Todo, idx, target: HTMLInputElement) {
    if (todo.isCompleted) {
      return;
    }
    this.todos = this.todos.map(
      _todo => new Todo(_todo.content, _todo.isCompleted, false)
    );
    this.refreshTodoList(idx, todo.toggleEdit());
    target.focus();
  }

  updateContent(content: string, idx) {
    this.refreshTodoList(idx, new Todo(content));
  }

  cancelUpdate(todo: Todo, idx) {
    this.refreshTodoList(idx, todo.toggleEdit());
  }

  private refreshTodoList(idx, todo: Todo | null = null) {
    if (!!todo) {
      this.todos.splice(idx, 1, todo);
    } else {
      this.todos.splice(idx, 1);
    }
  }
}
