"use client";
import { useState, useEffect } from "react";
import {
  deleteTask,
  getUpcomingTasks,
  updateTasks,
} from "../services/apiService";
import { Priority, TaskList } from "../models/task";
import AddTaskModal from "../components/addTaskModal";
import TaskDetailViewModal from "../components/taskDetailViewModal";

export default function Upcoming() {
  const [tasks, setTasks] = useState<TaskList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("_id") : "";
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskList | null>(null);
  const closeDetailView = () => {
    setSelectedTask(null);
    setIsDetailViewOpen(false);
  };
  const openDetailView = (task: TaskList) => {
    setSelectedTask(task);
    setIsDetailViewOpen(true);
  };
  const fetchTasks = async () => {
    if (userId) {
      try {
        const response = await getUpcomingTasks(userId);
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
  }, []);

  const handleTaskAdded = () => {
    fetchTasks();
  };

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
    <div
      className="container mx-auto py-6 p-2 h-screen overflow-y-auto"
      id="root"
      style={{ width: `75%` }}
    >
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 0;
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-4">Upcoming Tasks</h1>
      <div className="grid grid-cols-3 gap-4">
        {tasks &&
          tasks.length > 0 &&
          tasks.map((task, index) => (
            <div key={task?._id} className="mb-4 mr-4 p-3 rounded border">
              <input
                type="checkbox"
                className="mr-2 cursor-pointer"
                checked={task?.isDone}
                onChange={() => handleTaskDone(task)}
              />
              <div className="flex items-start">
                <div className={`flex-1 text-base`}>
                  {task?.date && (
                    <p className="text-gray-600 mb-1">
                      {new Date(task?.date).toDateString()}
                    </p>
                  )}
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
                  {task?.subTasksDetails &&
                    task?.subTasksDetails.length > 0 && (
                      <div className="flex mb-1">
                        <div className="flex">
                          Subtasks
                          {task?.subTasksDetails.map((sub, index) => (
                            <span
                              key={index}
                              className="bg-blue-200 px-1 py-0.5 rounded ml-2"
                            >
                              <p
                                className={`mb-1 ${
                                  sub?.isDone
                                    ? "line-through text-gray-500"
                                    : ""
                                }`}
                              >
                                {sub?.name}
                              </p>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  <button
                    onClick={() => openDetailView(task)}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    View Details
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteTask(task?._id)}
                  className="ml-2 px-2 py-1 bg-red-800 text-white border-zinc-800"
                >
                  Del
                </button>
                {index < tasks.length - 1 && (
                  <hr className="my-4 border-t-2 border-gray-300" />
                )}{" "}
              </div>
            </div>
          ))}
      </div>
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
      {isDetailViewOpen && selectedTask && (
        <TaskDetailViewModal task={selectedTask} onClose={closeDetailView} />
      )}
    </div>
  );
}
