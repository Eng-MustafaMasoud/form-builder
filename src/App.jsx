import React, { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { message } from "antd";
import FormBuilder from "./components/FormBuilder";
import BuiltForm from "./components/BuiltForm";
import "./App.css";

function App() {
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [builtForms, setBuiltForms] = useState([]);

  const handleFormSubmit = (values, formId) => {
    console.log("Form submitted:", values, "Form ID:", formId);
    // You can handle the form submission here
  };

  const handleFormBuilt = (formData) => {
    // Check if a form with the same title already exists
    const existingForm = builtForms.find(
      (form) => form.title === formData.title
    );

    if (existingForm) {
      // Show error message
      message.error(
        `A form with the title "${formData.title}" already exists. Please use a different title.`
      );
      return false; // Return false to indicate failure
    }

    const newForm = {
      ...formData,
      id: Date.now().toString(), // Generate unique ID
      createdAt: new Date().toISOString(),
    };
    setBuiltForms((prev) => [...prev, newForm]);
    return true; // Return true to indicate success
  };

  const handleDeleteForm = (formId) => {
    setBuiltForms((prev) => prev.filter((form) => form.id !== formId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sticky Settings Icon */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsFormBuilderOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20 backdrop-blur-sm"
          title="Form Builder"
        >
          <SettingOutlined className="text-2xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
            Form Builder App
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create beautiful, responsive forms with our intuitive drag-and-drop
            form builder. Click the settings icon to start building your forms!,
            that app for helping to use it a seperate component
          </p>
        </div>

        {/* Built Forms Display */}
        {builtForms.length > 0 && (
          <div className="space-y-8">
            {builtForms.map((form) => (
              <div key={form.id} className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 bg-white px-6 py-3 rounded-lg shadow-md">
                    {form.title}
                  </h3>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Delete Form
                  </button>
                </div>
                <BuiltForm
                  formData={form}
                  onSubmit={(values) => handleFormSubmit(values, form.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Welcome message when no forms exist */}
        {builtForms.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🎨</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Create Your First Form?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Click the settings icon in the top right corner to open the form
                builder and start creating beautiful forms.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsFormBuilderOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Building Forms
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Builder Modal */}
      {isFormBuilderOpen && (
        <FormBuilder
          isOpen={isFormBuilderOpen}
          onClose={() => setIsFormBuilderOpen(false)}
          onFormBuilt={handleFormBuilt}
        />
      )}
    </div>
  );
}

export default App;
