export class Todo {
  readonly content: string;
  readonly isCompleted: boolean;
  constructor(content: string, isCompleted: boolean = false) {
    this.content = content;
    this.isCompleted = isCompleted;
  }

  toggleComplete() {
    return new Todo(this.content, !this.isCompleted);
  }

  updateContent(content: string) {
    return new Todo(content, this.isCompleted);
  }
}
