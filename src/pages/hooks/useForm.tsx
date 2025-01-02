// useLoginForm.js
import { useForm } from "react-hook-form";

import {
  SubmitHandler,
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";

interface UseLoginFormProps {
  onSubmit: SubmitHandler<any>;
}

interface UseLoginFormReturn {
  register: UseFormRegister<any>;
  handleSubmit: ReturnType<UseFormHandleSubmit<any>>;
  errors: FieldErrors<any>;
  reset: () => void;
}

export default function useLoginForm({
  onSubmit,
}: UseLoginFormProps): UseLoginFormReturn {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Return all necessary data and methods
  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    reset,
  };
}
