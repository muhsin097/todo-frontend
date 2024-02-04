export interface Task {
  name: string;
  description?: string;
  date: Date;
  time?: any;
  priority?: Priority | undefined;
  labels?: string[];
  project?: string;
  userId?: string;
  subTasks?: any[];
}

export interface Project {
  name: string;
  description: string;
}

export interface TaskList extends Task {
  _id: string;
  isDone: boolean;
  subTasksDetails?: TaskList[];
}

export enum Priority {
  HIGH = "High",
  LOW = "Low",
  MEDIUM = "Medium",
}
