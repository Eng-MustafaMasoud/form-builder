import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Button, Space } from "antd";
import { DragOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SortableComponent = ({
  component,
  onEdit,
  onRemove,
  isSelected,
  onSelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`mb-4 ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
    >
      <Card
        size="small"
        className={`cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-300"
        }`}
        onClick={() => onSelect(component.id)}
      >
        <div className="flex items-center justify-between p-1 lg:p-2">
          <div className="flex items-center flex-1 min-w-0">
            <div
              {...listeners}
              className="mr-2 lg:mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-600 p-1 lg:p-2 rounded hover:bg-blue-50 transition-colors"
            >
              <DragOutlined className="text-base lg:text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm lg:text-base mb-1 truncate">
                {component.label || "Untitled Field"}
              </div>
              <div className="text-xs lg:text-sm text-gray-500 capitalize">
                {component.type}{" "}
                {component.required && (
                  <span className="text-red-500 font-medium">(Required)</span>
                )}
              </div>
              {component.placeholder && (
                <div className="text-xs text-gray-400 mt-1 truncate">
                  Placeholder: "{component.placeholder}"
                </div>
              )}
            </div>
          </div>
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(component.id);
              }}
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="hover:bg-red-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(component.id);
              }}
            />
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default SortableComponent;
