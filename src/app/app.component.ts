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
}
