"use client";
import { useState, useEffect } from "react";
import { deleteTask, getTodaysTasks, updateTasks } from "./services/apiService";
import { Priority, TaskList } from "./models/task";
import AddTaskModal from "./components/addTaskModal";

export default function Home() {
  const [tasks, setTasks] = useState<TaskList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("_id") : "";
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    if (userId) {
      try {
        const response = await getTodaysTasks(userId, searchTerm);
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskDone = async (task: TaskList) => {
    task.isDone = !task?.isDone;
    try {
      await updateTasks(task?._id, task);
      fetchTasks();
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchTerm]);

  const handleTaskAdded = () => {
    fetchTasks();
  };

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  // };

  const getPriorityFlag = (priority: string): string => {
    switch (priority) {
      case Priority.HIGH:
        return "text-red-500";
      case Priority.MEDIUM:
        return "text-orange-500";
      case Priority.LOW:
        return "text-yellow-500";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto p-2 " id="root" style={{ width: `50%` }}>
      <h1 className="text-2xl font-bold mb-4">Today&apos;s Tasks</h1>
      {/* <div className="mb-4">
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          name="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-input"
        />
      </div> */}
      <ul>
        {tasks &&
          tasks.length > 0 &&
          tasks.map((task, index) => (
            <li key={task?._id} className="mb-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  checked={task?.isDone}
                  onChange={() => handleTaskDone(task)}
                />
                <div className={`flex-1 text-base`}>
                  <p
                    className={`mb-1 ${
                      task?.isDone ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task?.name}
                  </p>
                  {task?.description && (
                    <p className="text-gray-600 mb-1">{task?.description}</p>
                  )}
                  {task?.time && (
                    <p className="text-gray-600 mb-1">{task?.time}</p>
                  )}
                  {task?.labels && task?.labels.length > 0 && (
                    <div className="flex mb-1">
                      <div className="flex">
                        {task?.labels.map((label, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 px-1 py-0.5 rounded mr-1"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {task?.priority && (
                    <p
                      className={`text-base ${getPriorityFlag(task?.priority)}`}
                    >
                      {task?.priority}{" "}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteTask(task?._id)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
                {index < tasks.length - 1 && (
                  <hr className="my-4 border-t-2 border-gray-300" />
                )}{" "}
              </div>
            </li>
          ))}
      </ul>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
      >
        Add Task
      </button>
      <AddTaskModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
}
