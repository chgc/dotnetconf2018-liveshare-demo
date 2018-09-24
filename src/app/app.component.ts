import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo';
  newTodo = '';
  todos = [];

  addTodo(){
    this.todos.push(this.newTodo);
    this.newTodo = '';
  }
}
