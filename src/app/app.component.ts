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
  todos = [];

  addTodo() {
    this.todos.push(new Todo(this.newTodo));
    this.newTodo = '';
  }
}
