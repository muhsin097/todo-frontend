"use client";
import { useState, useEffect } from "react";
import { getLabels, deleteLabel, addLabel } from "../services/apiService";

export default function Filters() {
  const [allLabels, setAllLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState<string>("");
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("_id") : "";
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

  const handleDeleteLabel = async (labelToDelete: string) => {
    if (userId) {
      try {
        await deleteLabel(labelToDelete, userId);
        fetchLabels();
      } catch (error) {
        console.error("Error deleting label:", error);
      }
    }
  };

  const handleAddLabel = async () => {
    if (newLabel.trim() !== "" && userId) {
      try {
        await addLabel(newLabel, userId);
        setNewLabel("");
        fetchLabels();
      } catch (error) {
        console.error("Error adding label:", error);
      }
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  return (
    <div className="container mx-auto p-2 " id="root" style={{ width: `50%` }}>
      <h1 className="text-2xl font-bold mb-4">Filters & Labels</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="New Label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="p-2 border border-gray-300 mr-2"
        />
        <button
          onClick={handleAddLabel}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Label
        </button>
      </div>
      <div className="flex flex-wrap">
        {allLabels &&
          allLabels?.length > 0 &&
          allLabels?.map((label) => (
            <div key={label} className="relative mb-2 mr-2">
              <div className="bg-gray-200 px-3 py-2 rounded">
                {label}
                <span
                  onClick={() => handleDeleteLabel(label)}
                  className="ml-2 p-1 cursor-pointer text-red-500"
                >
                  &#x2715;
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
