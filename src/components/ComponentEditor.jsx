import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, InputNumber, Button, Space } from "antd";

const ComponentEditor = ({ component, visible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (component) {
      form.setFieldsValue({
        label: component.label,
        placeholder: component.placeholder,
        required: component.required,
        minLength: component.validation?.minLength,
        maxLength: component.validation?.maxLength,
        options: component.options?.join("\n") || "",
      });
    }
  }, [component, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const updatedComponent = {
        ...component,
        label: values.label,
        placeholder: values.placeholder,
        required: values.required,
        validation: {
          ...component.validation,
          required: values.required,
          minLength: values.minLength,
          maxLength: values.maxLength,
        },
        options: values.options
          ? values.options.split("\n").filter((opt) => opt.trim())
          : [],
      };
      onSave(updatedComponent);
    });
  };

  const showOptionsField =
    component?.type === "select" || component?.type === "radio";

  return (
    <Modal
      title={`Edit ${component?.type || "Component"}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="label"
          label="Label"
          rules={[{ required: true, message: "Please enter a label" }]}
        >
          <Input placeholder="Enter field label" />
        </Form.Item>

        <Form.Item name="placeholder" label="Placeholder">
          <Input placeholder="Enter placeholder text" />
        </Form.Item>

        <Form.Item name="required" label="Required" valuePropName="checked">
          <Switch />
        </Form.Item>

        {(component?.type === "text" ||
          component?.type === "textarea" ||
          component?.type === "email") && (
          <>
            <Form.Item name="minLength" label="Minimum Length">
              <InputNumber min={0} placeholder="Min length" />
            </Form.Item>

            <Form.Item name="maxLength" label="Maximum Length">
              <InputNumber min={1} placeholder="Max length" />
            </Form.Item>
          </>
        )}

        {showOptionsField && (
          <Form.Item name="options" label="Options (one per line)">
            <Input.TextArea
              rows={4}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ComponentEditor;
