export class Todo {
  readonly content: string;
  readonly isCompleted: boolean;
  readonly isEdit: boolean;
  readonly id: number;
  constructor(
    id: number,
    content: string,
    isCompleted: boolean = false,
    isEdit: boolean = false
  ) {
    this.id = id;
    this.content = content;
    this.isCompleted = isCompleted;
    this.isEdit = isEdit;
  }

  static create(content: string) {
    return new Todo(0, content);
  }
  toggleComplete() {
    return new Todo(this.id, this.content, !this.isCompleted);
  }

  updateContent(content: string) {
    return new Todo(this.id, content, this.isCompleted);
  }

  toggleEdit() {
    return new Todo(this.id, this.content, this.isCompleted, !this.isEdit);
  }
}
