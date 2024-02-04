import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import {
  addLabel,
  addTasks,
  getLabels,
  getUpcomingTasks,
} from "../services/apiService";
import { Task, Priority, TaskList } from "../models/task";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const AddTaskModal = ({ isOpen, onRequestClose, onTaskAdded }: any) => {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("_id") : "";
  const [formData, setFormData] = useState<Task>({
    name: "",
    description: "",
    priority: Priority.LOW,
    labels: [],
    date: new Date(),
    time: undefined,
    project: "",
    userId: userId || "",
    subTasks: [],
  });
  const [tasks, setTasks] = useState<TaskList[]>([]);

  const [allLabels, setAllLabels] = useState<string[]>([]);

  const fetchLabels = async () => {
    if (userId) {
      try {
        const { labels } = await getLabels(userId);
        setAllLabels(labels);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    }
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

  useEffect(() => {
    fetchLabels();
    fetchTasks();
  }, [userId]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prevData) => ({ ...prevData, date: date || new Date() }));
  };

  const handleTimeChange = (time: any) => {
    setFormData((prevData) => ({ ...prevData, time }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    const transformedData = {
      ...formData,
      subTasks: formData?.subTasks?.map((task) => task._id),
    };
    if (userId) {
      e.preventDefault();
      try {
        transformedData.userId = userId;
        await addTasks(transformedData);
        onTaskAdded();
        onRequestClose();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const priorityOptions = Object.values(Priority).map((priority) => ({
    value: priority,
    label: priority,
  }));

  const labelOptions = allLabels?.map((label) => ({ value: label, label }));
  const subTasksList = tasks?.map((task) => ({
    value: task?._id,
    label: task?.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Task Modal"
      id="root"
      style={customStyles}
    >
      <div className="modal-content">
        <div className="modal-header flex items-start justify-between">
          <h2>Add Task</h2>
          <div>
            <button
              onClick={onRequestClose}
              className="px-3 py-2 bg-gray-300 text-gray-800 rounded"
            >
              Close
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="flex">
            <div className="w-1/2 pr-2">
              <div className="form-group">
                <label htmlFor="name">Task Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="w-1/2 pl-2">
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <DatePicker
                  id="date"
                  selected={formData.date}
                  onChange={handleDateChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="w-1/2 pl-2">
              <div className="form-group">
                <label htmlFor="time">Time:</label>
                <TimePicker
                  id="time"
                  value={formData.time}
                  onChange={handleTimeChange}
                  disableClock
                  className="form-select"
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <div className="form-group">
                <label htmlFor="priority">Priority:</label>
                <Select
                  id="priority"
                  name="priority"
                  value={{ value: formData.priority, label: formData.priority }}
                  onChange={(selectedOption) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      priority: selectedOption?.value,
                    }))
                  }
                  options={priorityOptions}
                  className="form-select"
                />
              </div>
            </div>
            <div className="w-1/2 pl-2">
              <div className="form-group">
                <label htmlFor="labels">Labels:</label>
                <div className="label-input-container">
                  <CreatableSelect
                    id="labels"
                    name="labels"
                    isMulti
                    value={formData?.labels?.map((label) => ({
                      value: label,
                      label,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        labels: selectedOptions?.map((option) => option.value),
                      }))
                    }
                    options={labelOptions}
                    className="form-select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full">
              <div className="form-group">
                <label htmlFor="subtasks">Subtasks:</label>
                <Select
                  id="subtasks"
                  name="subtasks"
                  isMulti
                  value={formData?.subTasks?.map((subtask) => ({
                    value: subtask?._id,
                    label: subtask?.name,
                  }))}
                  onChange={(selectedOptions) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      subTasks: selectedOptions?.map((option) => ({
                        _id: option.value,
                        name: option.label,
                      })),
                    }))
                  }
                  options={subTasksList}
                  className="form-select"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <button type="submit" className="form-button">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddTaskModal;
