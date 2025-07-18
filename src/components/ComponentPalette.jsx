import React from "react";
import { Card, Button, Space } from "antd";
import {
  FormOutlined,
  DownOutlined,
  CheckOutlined,
  BulbOutlined,
  FileTextOutlined,
  NumberOutlined,
  CalendarOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const componentTypes = [
  {
    type: "text",
    label: "Text Input",
    icon: <FormOutlined />,
    description: "Single line text input",
  },
  {
    type: "textarea",
    label: "Text Area",
    icon: <FileTextOutlined />,
    description: "Multi-line text input",
  },
  {
    type: "number",
    label: "Number Input",
    icon: <NumberOutlined />,
    description: "Numeric input field",
  },
  {
    type: "email",
    label: "Email Input",
    icon: <FormOutlined />,
    description: "Email address input",
  },
  {
    type: "password",
    label: "Password Input",
    icon: <FormOutlined />,
    description: "Password field",
  },
  {
    type: "select",
    label: "Select Dropdown",
    icon: <DownOutlined />,
    description: "Dropdown selection",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <CheckOutlined />,
    description: "Checkbox input",
  },
  {
    type: "radio",
    label: "Radio Button",
    icon: <BulbOutlined />,
    description: "Radio button group",
  },
  {
    type: "date",
    label: "Date Picker",
    icon: <CalendarOutlined />,
    description: "Date selection",
  },
  {
    type: "file",
    label: "File Upload",
    icon: <UploadOutlined />,
    description: "File upload field",
  },
];

const ComponentPalette = ({ onAddComponent }) => {
  const handleAddComponent = (componentType) => {
    const newComponent = {
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: componentType.type,
      label: componentType.label,
      placeholder: `Enter ${componentType.label.toLowerCase()}`,
      required: false,
      options:
        componentType.type === "select" || componentType.type === "radio"
          ? ["Option 1", "Option 2", "Option 3"]
          : [],
      validation: {
        required: false,
        minLength:
          componentType.type === "text" || componentType.type === "textarea"
            ? 0
            : undefined,
        maxLength:
          componentType.type === "text" || componentType.type === "textarea"
            ? 100
            : undefined,
        pattern: componentType.type === "email" ? "email" : undefined,
      },
    };

    onAddComponent(newComponent);
  };

  return (
    <div className="space-y-3 lg:space-y-4 h-full overflow-y-auto">
      <div className="text-center mb-4 lg:mb-6">
        <h3 className="font-bold text-gray-800 text-base lg:text-lg mb-1 lg:mb-2">
          Form Components
        </h3>
        <p className="text-xs lg:text-sm text-gray-600">
          Drag or click to add components
        </p>
      </div>

      <div className="space-y-2 lg:space-y-3">
        {componentTypes.map((component) => (
          <Card
            key={component.type}
            size="small"
            className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-2 border-gray-100 hover:border-blue-300"
            onClick={() => handleAddComponent(component)}
          >
            <div className="flex items-center space-x-2 lg:space-x-4 p-1 lg:p-2">
              <div className="text-blue-600 text-lg lg:text-xl bg-blue-50 p-1 lg:p-2 rounded-lg">
                {component.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm lg:text-base truncate">
                  {component.label}
                </div>
                <div className="text-xs lg:text-sm text-gray-500 mt-1 truncate">
                  {component.description}
                </div>
              </div>
              <div className="text-blue-400 text-sm lg:text-base">+</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg lg:rounded-xl border border-blue-200">
        <div className="text-center">
          <div className="text-blue-600 text-xl lg:text-2xl mb-1 lg:mb-2">
            💡
          </div>
          <p className="text-xs lg:text-sm text-blue-700 font-medium">
            Click on any component to add it to your form. You can then
            configure its properties and reorder them using drag and drop.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;
