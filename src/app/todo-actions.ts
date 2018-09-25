import { Todo } from './model/todo';

export type ActionType =
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
    return [new Todo(maxId, value.todo.content), ...acc];
  },
  Update: (acc, value) =>
    acc.map(todo => (todo.id === value.todo.id ? value.todo : todo)),
  Delete: (acc, value) => acc.filter(todo => todo.id !== value.todo.id),
  CancelAllEdit: (acc, value) =>
    acc.map(todo => new Todo(todo.id, todo.content, todo.isCompleted, false)),
  ClearComplete: (acc, value) => acc.filter(todo => !todo.isCompleted),
  MarkAllComplete: (acc, value) =>
    acc.map(todo => new Todo(todo.id, todo.content, true, todo.isEdit))
};
