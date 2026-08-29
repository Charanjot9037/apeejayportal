
import React from "react";
import ProjectDetail from "../../../components/projectDetail/index";

const Page = () => {
  return (
    <div className="px-4 py-6">
      <ProjectDetail
        backHref="/hod-dashboard"
        backLabel="Back to Dashboard"
      />
    </div>
  );
};

export default Page;

