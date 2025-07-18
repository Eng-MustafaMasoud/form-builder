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

const BuiltForm = ({ formData, onSubmit }) => {
  if (!formData) return null;

  const { components, layout } = formData;

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
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  {...field}
                  placeholder={placeholder}
                  type={type}
                  className={meta.touched && meta.error ? "border-red-500" : ""}
                />
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        );

      case "textarea":
        return (
          <Field name={id}>
            {({ field, meta }) => (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <TextArea
                  {...field}
                  placeholder={placeholder}
                  rows={4}
                  className={meta.touched && meta.error ? "border-red-500" : ""}
                />
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        );

      case "number":
        return (
          <Field name={id}>
            {({ field, meta }) => (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  {...field}
                  type="number"
                  placeholder={placeholder}
                  className={meta.touched && meta.error ? "border-red-500" : ""}
                />
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        );

      case "select":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <Select
                  {...field}
                  placeholder={placeholder}
                  onChange={(value) => form.setFieldValue(id, value)}
                  onBlur={() => form.setFieldTouched(id, true)}
                  className={meta.touched && meta.error ? "border-red-500" : ""}
                >
                  {options.map((option, index) => (
                    <Option key={index} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        );

      case "checkbox":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <Checkbox
                  checked={field.value}
                  onChange={(e) => form.setFieldValue(id, e.target.checked)}
                  onBlur={() => form.setFieldTouched(id, true)}
                >
                  {placeholder}
                </Checkbox>
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        );

      case "radio":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
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
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        );

      case "date":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <DatePicker
                  {...field}
                  placeholder={placeholder}
                  onChange={(date, dateString) =>
                    form.setFieldValue(id, dateString)
                  }
                  onBlur={() => form.setFieldTouched(id, true)}
                  style={{ width: "100%" }}
                  className={meta.touched && meta.error ? "border-red-500" : ""}
                />
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        );

      case "file":
        return (
          <Field name={id}>
            {({ field, meta, form }) => (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <Upload
                  beforeUpload={() => false}
                  onChange={(info) => {
                    form.setFieldValue(id, info.fileList);
                  }}
                  fileList={field.value || []}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values);
    if (onSubmit) {
      onSubmit(values, formData.id);
    }
    message.success("Form submitted successfully!");
    setSubmitting(false);
  };

  const getLayoutClass = () => {
    return layout === "two-column"
      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
      : "space-y-6";
  };

  const getFieldLayoutClass = () => {
    return "flex flex-col space-y-2";
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mb-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 text-center">
        Built Form
      </h2>

      <Formik
        initialValues={{}}
        validationSchema={buildValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={getLayoutClass()}>
              {components.map((component) => (
                <div key={component.id} className={getFieldLayoutClass()}>
                  {renderField(component)}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 px-8 py-3 h-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Submit Form
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BuiltForm;
