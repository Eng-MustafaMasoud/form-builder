import React from "react";
import FormRenderer from "./FormRenderer";

const FormPreview = ({ components, values, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Preview</h3>
      <FormRenderer
        components={components}
        values={values}
        onChange={onChange}
      />
    </div>
  );
};

export default FormPreview;
