export interface Task {
  name: string;
  description?: string;
  date: Date;
  time?: any;
  priority?: Priority | undefined;
  labels?: string[];
  project?: string;
  userId?: string;
}

export interface Project {
  name: string;
  description: string;
}

export interface TaskList extends Task {
  _id: string;
  isDone: boolean;
}

export enum Priority {
  HIGH = "High",
  LOW = "Low",
  MEDIUM = "Medium",
}
