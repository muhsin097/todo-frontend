import React, { useState } from "react";
import Modal from "react-modal";
import { TaskList } from "../models/task";

const TaskDetailViewModal = ({
  task,
  onClose,
}: {
  task: TaskList;
  onClose: () => void;
}) => {
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(false);

  const handleToggleSubtasks = () => {
    setIsSubtasksExpanded((prev) => !prev);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Task Detail View Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          borderRadius: "8px",
          padding: "20px",
        },
      }}
    >
      <div className="modal-content">
        <div className="modal-header flex items-start justify-between">
          <h2 className="text-xl font-semibold mb-2">Task Details</h2>
          <div>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
        <div className="modal-body">
          <p className="mb-2 font-bold">Task Name:</p>
          <p>{task?.name}</p>

          {task?.description && (
            <>
              <p className="mb-2 font-bold">Description:</p>
              <p>{task?.description}</p>
            </>
          )}

          {task?.time && (
            <>
              <p className="mb-2 font-bold">Time:</p>
              <p>{task?.time}</p>
            </>
          )}

          {task?.labels && task?.labels.length > 0 && (
            <>
              <p className="mb-2 font-bold">Labels:</p>
              <div className="flex mb-2">
                {task?.labels.map((label, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded mr-1"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </>
          )}

          {task?.priority && (
            <>
              <p className="mb-2 font-bold">Priority:</p>
              <p>{task?.priority}</p>
            </>
          )}

          {task?.subTasksDetails && task?.subTasksDetails.length > 0 && (
            <>
              <p
                className="mb-2 font-bold cursor-pointer text-blue-500"
                onClick={handleToggleSubtasks}
              >
                {isSubtasksExpanded ? "Close Subtasks" : "Show Subtasks"}
              </p>
              {isSubtasksExpanded && (
                <ul>
                  {task?.subTasksDetails.map((subtask, index) => (
                    <li key={index}>
                      <div className="mb-1">
                        <p
                          className={`mb-1 ${
                            subtask?.isDone ? "line-through text-gray-500" : ""
                          } font-semibold text-sm`}
                        >
                          {subtask?.name}
                        </p>
                        {subtask?.description && (
                          <p className="text-gray-600">
                            {subtask?.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailViewModal;
