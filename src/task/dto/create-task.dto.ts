export class CreateTaskDto {
  name: string;
  description: string;
  date: Date;
  time?: string;
  priority?: string;
  labels?: string[];
  projectName?: string;
  projectDescription?: string;
  projectId?: string;
  status: boolean;
  userId: string;
}
