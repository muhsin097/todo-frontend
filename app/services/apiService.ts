import axios from "axios";
import { Task, TaskList } from "../models/task";

const apiDomain = process.env.NEXT_PUBLIC_API_URL;

export async function getTodaysTasks(
  userId: string,
  searchTerm: string
): Promise<TaskList[] | []> {
  try {
    const query = searchTerm ? `&name=${searchTerm}` : undefined;
    let url = `${apiDomain}/task/today/${userId}`;
    if (query) {
      url += query;
    }
    const data: any = await axios.get(url);
    return data?.data;
  } catch (err) {
    return [];
  }
}

export async function getUpcomingTasks(
  userId: string
): Promise<TaskList[] | []> {
  try {
    const url = `${apiDomain}/task/upcoming/${userId}`;
    const data: any = await axios.get(url);
    return data?.data;
  } catch (err) {
    return [];
  }
}

export async function deleteTask(taskId: string) {
  try {
    const url = `${apiDomain}/task/${taskId}`;
    const data: any = await axios.delete(url);
    return data?.data;
  } catch (err) {
    return [];
  }
}

export async function addTasks(task: Task) {
  try {
    const url = `${apiDomain}/task/`;
    const data: any = await axios.post(url, task);
    return data?.data;
  } catch (err) {
    return [];
  }
}

export async function updateTasks(taskId: string, task: Task) {
  try {
    const url = `${apiDomain}/task/${taskId}`;
    const data: any = await axios.put(url, task);
    return data?.data;
  } catch (err) {
    return [];
  }
}

export async function getLabels(userId: string) {
  try {
    const url = `${apiDomain}/label/${userId}`;
    const data: any = await axios.get(url);
    return data?.data;
  } catch (err) {
    return null;
  }
}
export async function deleteLabel(label: string, userId: string) {
  try {
    const url = `${apiDomain}/label/${userId}/${label}`;
    const data: any = await axios.delete(url);
    return data?.data;
  } catch (err) {
    return [];
  }
}

export async function addLabel(label: string, userId: string) {
  try {
    const labelData = { name: label, userId };
    const url = `${apiDomain}/label/`;
    const data: any = await axios.post(url, labelData);
    return data?.data;
  } catch (err) {
    return [];
  }
}
export async function login(loginData: { username: string; password: string }) {
  try {
    const url = `${apiDomain}/auth/login`;
    const data: any = await axios.post(url, loginData);
    return data?.data;
  } catch (err: any) {
    return err?.response?.data?.message;
  }
}
