import { Component } from '@angular/core';
import { Todo } from './model/todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo';
  newTodo = '';
  todos: Todo[] = [];

  get itemLeft() {
    return this.todos.filter(todo => !todo.isCompleted).length;
  }

  addTodo() {
    this.todos.push(new Todo(this.newTodo));
    this.newTodo = '';
  }

  toggleComplete(todo: Todo, idx) {
    this.todos.splice(idx, 1, todo.toggleComplete());
  }

  removeTodo(idx) {
    this.todos.splice(idx, 1);
  }

  markAllComplete() {
    this.todos = this.todos.map(todo => new Todo(todo.content, true));
  }

  clearComplete() {
    this.todos = this.todos.filter(todo => !todo.isCompleted);
  }

  enterEdit(todo: Todo, idx, target) {
    if (todo.isCompleted) {
      return;
    }
    this.todos = this.todos.map(
      _todo => new Todo(_todo.content, _todo.isCompleted, false)
    );
    this.todos.splice(idx, 1, todo.toggleEdit());
  }

  updateContent(content: string, idx) {
    this.todos.splice(idx, 1, new Todo(content));
  }

  cancelUpdate(todo: Todo, idx) {
    this.todos.splice(idx, 1, todo.toggleEdit());
  }
}
