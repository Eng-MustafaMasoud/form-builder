import React, { useState } from "react";
import { Modal, Tabs, Button, Space, message, Radio, Card, Input } from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  EyeOutlined,
  DragOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ComponentPalette from "./ComponentPalette";
import FormPreview from "./FormPreview";
import FormRenderer from "./FormRenderer";
import ComponentEditor from "./ComponentEditor";
import SortableComponent from "./SortableComponent";
import { useFormBuilder } from "../hooks/useFormBuilder";

const { TabPane } = Tabs;

const FormBuilder = ({ isOpen, onClose, onFormBuilt }) => {
  const {
    formComponents,
    addComponent,
    updateComponent,
    removeComponent,
    reorderComponents,
    formValues,
    setFormValues,
    validationSchema,
    formLayout,
    setFormLayout,
    buildForm,
    resetForm,
  } = useFormBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = formComponents.findIndex(
        (comp) => comp.id === active.id
      );
      const newIndex = formComponents.findIndex((comp) => comp.id === over.id);
      reorderComponents(oldIndex, newIndex);
    }
  };

  const [activeTab, setActiveTab] = useState("builder");
  const [showPreview, setShowPreview] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [formTitle, setFormTitle] = useState("My Form");
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const handleSaveForm = () => {
    if (formComponents.length === 0) {
      message.warning("Please add at least one component to your form");
      return;
    }

    if (!formTitle.trim()) {
      message.warning("Please enter a form title");
      return;
    }

    const builtFormData = buildForm();
    if (builtFormData && onFormBuilt) {
      const result = onFormBuilt({
        ...builtFormData,
        title: formTitle.trim(),
      });

      // If form was successfully created (no duplicate), close modal
      if (result !== false) {
        message.success("Form built successfully! Check the page below.");
        onClose();
      }
    }
  };

  const handleReset = () => {
    resetForm();
    message.info("Form has been reset");
  };

  const handleEditComponent = (component) => {
    setEditingComponent(component);
    setIsEditorVisible(true);
    setSelectedComponentId(component.id);
  };

  const handleSelectComponent = (componentId) => {
    setSelectedComponentId(componentId);
  };

  const handleSaveComponent = (updatedComponent) => {
    updateComponent(updatedComponent.id, updatedComponent);
    setIsEditorVisible(false);
    setEditingComponent(null);
    message.success("Component updated successfully!");
  };

  // Auto-scroll to bottom when new components are added
  React.useEffect(() => {
    if (formComponents.length > 0) {
      const componentsContainer = document.querySelector(
        ".form-builder-components"
      );
      if (componentsContainer) {
        componentsContainer.scrollTop = componentsContainer.scrollHeight;
      }
    }
  }, [formComponents.length]);

  const handleCancelEdit = () => {
    setIsEditorVisible(false);
    setEditingComponent(null);
  };

  return (
    <Modal
      title={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Form Builder
          </span>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              icon={<EyeOutlined />}
              onClick={() => setShowPreview(!showPreview)}
              type={showPreview ? "primary" : "default"}
              size="small"
              className={`${
                showPreview
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
              } transition-all duration-300 text-xs sm:text-sm`}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              onClick={handleSaveForm}
              size="small"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
            >
              Save Form
            </Button>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width="95vw"
      style={{ top: 10, maxHeight: "95vh" }}
      footer={null}
      className="form-builder-modal"
      styles={{
        body: {
          padding: "12px",
          maxHeight: "85vh",
          overflow: "auto",
        },
        header: {
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 16px",
        },
      }}
    >
      <div
        className="flex flex-col lg:flex-row gap-3 lg:gap-4 pb-4"
        style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}
      >
        {/* Left Panel - Component Palette */}
        <div className="w-full lg:w-1/4 bg-gradient-to-b from-gray-50 to-gray-100 p-3 lg:p-6 rounded-xl overflow-y-auto border border-gray-200 shadow-lg min-h-0">
          <ComponentPalette onAddComponent={addComponent} />
        </div>

        {/* Center Panel - Form Builder */}
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{ height: "100%", minHeight: "600px" }}
        >
          {/* Form Title and Layout Controls */}
          <div className="mb-3 lg:mb-4 p-3 lg:p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200/60 shadow-lg backdrop-blur-sm">
            <div className="mb-2 lg:mb-3">
              <h3 className="font-semibold text-gray-800 mb-1 lg:mb-2 text-xs lg:text-sm">
                Form Title
              </h3>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter form title"
                size="small"
                className="w-full h-7 lg:h-10 text-xs lg:text-base border border-gray-200 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 lg:mb-2 text-xs lg:text-sm">
                Form Layout
              </h3>
              <Radio.Group
                value={formLayout}
                onChange={(e) => setFormLayout(e.target.value)}
                className="flex flex-col sm:flex-row gap-1 lg:gap-2"
                size="small"
              >
                <Radio.Button
                  value="single"
                  className="flex-1 text-center h-7 lg:h-8 text-xs lg:text-sm font-medium border hover:border-blue-500 transition-all duration-300"
                >
                  Single Column
                </Radio.Button>
                <Radio.Button
                  value="two-column"
                  className="flex-1 text-center h-7 lg:h-8 text-xs lg:text-sm font-medium border hover:border-blue-500 transition-all duration-300"
                >
                  Two Columns
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {/* Tab Navigation - Sticky */}
          <div className="sticky top-0 z-10 flex mb-3 lg:mb-4 border-b bg-white rounded-t-lg shadow-sm">
            <button
              className={`flex-1 px-2 lg:px-6 py-1.5 lg:py-3 text-xs lg:text-base font-semibold transition-colors ${
                activeTab === "builder"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("builder")}
            >
              Form Builder
            </button>
            <button
              className={`flex-1 px-2 lg:px-6 py-1.5 lg:py-3 text-xs lg:text-base font-semibold transition-colors ${
                activeTab === "preview"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              Form Preview
            </button>
          </div>

          {/* Tab Content */}
          <div
            className="flex-1 overflow-hidden"
            style={{ height: "calc(100% - 30px)", minHeight: "500px" }}
          >
            {activeTab === "builder" && (
              <div
                className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col"
                style={{ overflow: "hidden", minHeight: "450px" }}
              >
                {formComponents.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <PlusOutlined className="text-4xl mb-4" />
                      <p>
                        Drag components from the left panel to start building
                        your form
                      </p>
                    </div>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={formComponents.map((comp) => comp.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div
                        className="space-y-4 form-builder-components flex-1 overflow-y-auto pr-2"
                        style={{
                          minHeight: "0",
                        }}
                      >
                        {formComponents.map((component) => (
                          <SortableComponent
                            key={component.id}
                            component={component}
                            onEdit={() => handleEditComponent(component)}
                            onRemove={() => removeComponent(component.id)}
                            isSelected={selectedComponentId === component.id}
                            onSelect={handleSelectComponent}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}

            {activeTab === "preview" && (
              <div
                className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col"
                style={{ overflow: "hidden", minHeight: "450px" }}
              >
                {showPreview ? (
                  <div className="flex-1 overflow-y-auto">
                    <FormRenderer
                      components={formComponents}
                      values={formValues}
                      onChange={setFormValues}
                      validationSchema={validationSchema}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-1 text-gray-500">
                    <p>Click "Show Preview" to see your form in action</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-3 lg:mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 lg:gap-3 p-3 lg:p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-md">
            <Button
              onClick={handleReset}
              size="small"
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white shadow-md hover:shadow-lg transition-all duration-300 text-xs lg:text-sm font-medium"
            >
              Reset Form
            </Button>
            <div className="text-center order-first sm:order-none">
              <div className="text-sm lg:text-lg font-bold text-gray-800 bg-white px-3 py-1 rounded-lg shadow-sm border">
                {formComponents.length} Component
                {formComponents.length !== 1 ? "s" : ""}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedComponentId
                  ? "Component selected"
                  : "Click to select a component"}
              </div>
            </div>
            <div className="text-xs text-gray-600">
              {formComponents.length > 0 && (
                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm border border-green-200">
                  Ready to save
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Values Tracker */}
        <div className="w-full lg:w-1/4 bg-gradient-to-b from-gray-50 to-gray-100 p-3 lg:p-6 rounded-xl overflow-y-auto border border-gray-200 shadow-lg min-h-0">
          <h3 className="font-bold text-gray-800 mb-3 lg:mb-6 text-sm lg:text-lg">
            Form Values
          </h3>
          <div className="space-y-2 h-full overflow-y-auto">
            {Object.keys(formValues).length === 0 ? (
              <p className="text-gray-500 text-xs lg:text-sm">No values yet</p>
            ) : (
              Object.entries(formValues).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white p-2 rounded text-xs lg:text-sm"
                >
                  <div className="font-medium text-gray-700">{key}:</div>
                  <div className="text-gray-600 break-all">
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Component Editor Modal */}
      <ComponentEditor
        component={editingComponent}
        visible={isEditorVisible}
        onCancel={handleCancelEdit}
        onSave={handleSaveComponent}
      />
    </Modal>
  );
};

export default FormBuilder;
