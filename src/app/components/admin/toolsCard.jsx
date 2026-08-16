"use client";

import React, { useState } from "react";
import BulkImport from "@/app/components/admin/bulkImport";
import AddMentor from "../../components/admin/addMentorCard";

const ToolsCard = () => {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="p-3">
      {/* Tabs */}
      <div className=" flex gap-2 border-b">
        <button
          onClick={() => {
            setActiveTab("student");
          }}
          className={`px-6 py-3 font-medium ${
            activeTab === "student"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500"
          }`}
        >
          Student
        </button>

        <button
          onClick={() => {
            setActiveTab("teacher");
          }}
          className={`px-6 py-3 font-medium ${
            activeTab === "teacher"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500"
          }`}
        >
          Teacher
        </button>
      </div>

      {/* Student Tab */}
      {activeTab === "student" && (
        <div>
          <BulkImport />
        </div>
      )}

      {activeTab === "teacher" && (
        <div>
          <AddMentor />
        </div>
      )}
    </div>
  );
};

export default ToolsCard;
