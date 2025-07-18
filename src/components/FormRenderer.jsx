import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  Checkbox,
  Radio,
  DatePicker,
  Upload,
  Button,
  Space,
  Form as AntForm,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const FormRenderer = ({ components, values, onChange }) => {
  // Build Yup validation schema from components
  const buildValidationSchema = () => {
    const schema = {};

    components.forEach((component) => {
      let fieldSchema = Yup.string();

      if (component.validation?.required) {
        fieldSchema = fieldSchema.required(`${component.label} is required`);
      }

      if (component.validation?.minLength) {
        fieldSchema = fieldSchema.min(
          component.validation.minLength,
          `${component.label} must be at least ${component.validation.minLength} characters`
        );
      }

      if (component.validation?.maxLength) {
        fieldSchema = fieldSchema.max(
          component.validation.maxLength,
          `${component.label} must be at most ${component.validation.maxLength} characters`
        );
      }

      if (component.validation?.pattern === "email") {
        fieldSchema = fieldSchema.email(
          `${component.label} must be a valid email`
        );
      }

      if (component.type === "number") {
        fieldSchema = Yup.number().typeError(
          `${component.label} must be a number`
        );
      }

      schema[component.id] = fieldSchema;
    });

    return Yup.object().shape(schema);
  };

  const renderField = (component) => {
    const { id, type, label, placeholder, required, options = [] } = component;

    switch (type) {
      case "text":
      case "email":
      case "password":
        return (
          <Field name={id}>
            {({ field, meta }) => (
              <AntForm.Item
                label={label}
                required={required}
                validateStatus={meta.touched && meta.error ? "error" : ""}
                help={meta.touched && meta.error ? meta.error : ""}
              >
                <Input {...field} placeholder={placeholder} type={type} />
              </AntForm.Item>
            )}
          </Field>
        );

      case "textarea":
        return (
          <Field name={id}>
            {({ field, meta }) => (
              <AntForm.Item
                label={label}
                required={required}
                validateStatus={meta.touched && meta.error ? "error" : ""}
                help={meta.touched && meta.error ? meta.error : ""}
              >
                <TextArea {...field} placeholder={placeholder} rows={4} />
              </AntForm.Item>
            )}
          </Field>
        );

      case "number":
        return (
          <Field name={id}>
            {({ field, meta }) => (
              <AntForm.Item
                label={label}
                required={required}
                validateStatus={meta.touched && meta.error ? "error" : ""}
                help={meta.touched && meta.error ? meta.error : ""}
              >
                <Input {...field} type="number" placeholder={placeholder} />
              </AntForm.Item>
            )}
          </Field>
        );

      case "select":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <AntForm.Item
                label={label}
                required={required}
                validateStatus={meta.touched && meta.error ? "error" : ""}
                help={meta.touched && meta.error ? meta.error : ""}
              >
                <Select
                  {...field}
                  placeholder={placeholder}
                  onChange={(value) => form.setFieldValue(id, value)}
                  onBlur={() => form.setFieldTouched(id, true)}
                >
                  {options.map((option, index) => (
                    <Option key={index} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </AntForm.Item>
            )}
          </Field>
        );

      case "checkbox":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <AntForm.Item
                label={label}
                required={required}
                validateStatus={meta.touched && meta.error ? "error" : ""}
                help={meta.touched && meta.error ? meta.error : ""}
              >
                <Checkbox
                  checked={field.value}
                  onChange={(e) => form.setFieldValue(id, e.target.checked)}
                  onBlur={() => form.setFieldTouched(id, true)}
                >
                  {placeholder}
                </Checkbox>
              </AntForm.Item>
            )}
          </Field>
        );

      case "radio":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <AntForm.Item
                label={label}
                required={required}
                validateStatus={meta.touched && meta.error ? "error" : ""}
                help={meta.touched && meta.error ? meta.error : ""}
              >
                <Radio.Group
                  value={field.value}
                  onChange={(e) => form.setFieldValue(id, e.target.value)}
                  onBlur={() => form.setFieldTouched(id, true)}
                >
                  {options.map((option, index) => (
                    <Radio key={index} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </AntForm.Item>
            )}
          </Field>
        );

      case "date":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <AntForm.Item
                label={label}
                required={required}
                validateStatus={meta.touched && meta.error ? "error" : ""}
                help={meta.touched && meta.error ? meta.error : ""}
              >
                <DatePicker
                  {...field}
                  placeholder={placeholder}
                  onChange={(date, dateString) =>
                    form.setFieldValue(id, dateString)
                  }
                  onBlur={() => form.setFieldTouched(id, true)}
                  style={{ width: "100%" }}
                />
              </AntForm.Item>
            )}
          </Field>
        );

      case "file":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <AntForm.Item
                label={label}
                required={required}
                validateStatus={meta.touched && meta.error ? "error" : ""}
                help={meta.touched && meta.error ? meta.error : ""}
              >
                <Upload
                  beforeUpload={() => false}
                  onChange={(info) => {
                    form.setFieldValue(id, info.fileList);
                  }}
                  fileList={field.value || []}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </AntForm.Item>
            )}
          </Field>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values);
    onChange(values);
    message.success("Form submitted successfully!");
    setSubmitting(false);
  };

  if (components.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No form components added yet.</p>
      </div>
    );
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={buildValidationSchema()}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="h-full flex flex-col">
          <div className="space-y-6 overflow-y-auto flex-1 pb-4">
            {components.map((component) => (
              <div key={component.id}>{renderField(component)}</div>
            ))}

            <AntForm.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Submit Form
                </Button>
                <Button onClick={() => onChange({})}>Clear Form</Button>
              </Space>
            </AntForm.Item>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormRenderer;
