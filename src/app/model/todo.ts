export class Todo {
  readonly content: string;
  readonly isCompleted: boolean;
  readonly isEdit: boolean;
  constructor(
    content: string,
    isCompleted: boolean = false,
    isEdit: boolean = false
  ) {
    this.content = content;
    this.isCompleted = isCompleted;
    this.isEdit = isEdit;
  }

  toggleComplete() {
    return new Todo(this.content, !this.isCompleted);
  }

  updateContent(content: string) {
    return new Todo(content, this.isCompleted);
  }

  toggleEdit() {
    return new Todo(this.content, this.isCompleted, !this.isEdit);
  }
}
