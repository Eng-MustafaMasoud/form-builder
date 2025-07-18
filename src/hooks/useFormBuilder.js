import { useState, useCallback } from "react";

export const useFormBuilder = () => {
  const [formComponents, setFormComponents] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [validationSchema, setValidationSchema] = useState({});
  const [formLayout, setFormLayout] = useState("single"); // 'single' or 'two-column'
  const [builtForm, setBuiltForm] = useState(null);

  const addComponent = useCallback((component) => {
    setFormComponents((prev) => [...prev, component]);
  }, []);

  const updateComponent = useCallback((id, updatedComponent) => {
    setFormComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, ...updatedComponent } : comp
      )
    );
  }, []);

  const removeComponent = useCallback((id) => {
    setFormComponents((prev) => prev.filter((comp) => comp.id !== id));
    setFormValues((prev) => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  }, []);

  const reorderComponents = useCallback((fromIndex, toIndex) => {
    setFormComponents((prev) => {
      const newComponents = [...prev];
      const [removed] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, removed);
      return newComponents;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormComponents([]);
    setFormValues({});
    setValidationSchema({});
    setBuiltForm(null);
  }, []);

  const buildForm = useCallback(() => {
    if (formComponents.length === 0) return null;

    const builtFormData = {
      components: formComponents,
      layout: formLayout,
      validationSchema: validationSchema,
      createdAt: new Date().toISOString(),
    };

    setBuiltForm(builtFormData);
    return builtFormData;
  }, [formComponents, formLayout, validationSchema]);

  return {
    formComponents,
    addComponent,
    updateComponent,
    removeComponent,
    reorderComponents,
    formValues,
    setFormValues,
    validationSchema,
    setValidationSchema,
    formLayout,
    setFormLayout,
    builtForm,
    buildForm,
    resetForm,
  };
};
