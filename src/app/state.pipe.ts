import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from './model/todo';

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {
  transform(todos: Todo[], filter?: '' | 'active' | 'completed'): any {
    switch (filter) {
      case 'active':
        return todos.filter(todo => todo.isCompleted === false);
      case 'completed':
        return todos.filter(todo => todo.isCompleted);
      default:
        return todos;
    }
  }
}
