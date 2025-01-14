import { FC, ReactNode } from "react";
import { Button } from "@/components/Atomic/button";

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  isLoading?: boolean;
}

export const AuthForm: FC<AuthFormProps> = ({
  children,
  onSubmit,
  submitText,
  isLoading = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {children}
      <div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : submitText}
        </Button>
      </div>
    </form>
  );
};
