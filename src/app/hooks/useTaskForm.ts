import { useState } from "react";
import { TaskPriority, TaskFormState, TaskFormErrors } from "@/types/task";

type TaskFormValue = string | Date | TaskPriority;

export const useTaskForm = (
  onSubmit: (
    projectId: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: TaskPriority,
  ) => void,
) => {
  const [formState, setFormState] = useState<TaskFormState>({
    title: "",
    description: "",
    assignee: "",
    dueDate: new Date(),
    priority: "中",
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});

  const validateForm = () => {
    const newErrors: TaskFormErrors = {};

    if (!formState.title) newErrors.title = "必須項目です";
    if (!formState.description) newErrors.description = "必須項目です";
    if (!formState.assignee) newErrors.assignee = "必須項目です";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (projectId: string) => {
    if (!validateForm()) return;

    onSubmit(
      projectId,
      formState.title,
      formState.description,
      formState.assignee,
      formState.dueDate,
      formState.priority,
    );
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      title: "",
      description: "",
      assignee: "",
      dueDate: new Date(),
      priority: "中",
    });
    setErrors({});
  };

  const updateField = (field: keyof TaskFormState, value: TaskFormValue) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formState,
    errors,
    updateField,
    handleSubmit,
    resetForm,
  };
};
