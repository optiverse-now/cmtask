import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "../form";

// テスト用のフォームコンポーネント
const TestForm = () => {
  const form = useForm();
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Label</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormDescription>Test Description</FormDescription>
              <FormMessage>Test Message</FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

describe("Form Components", () => {
  it("フォームの基本構造が正しくレンダリングされること", () => {
    render(<TestForm />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("FormLabelが適切なスタイルで表示されること", () => {
    render(<TestForm />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for");
  });

  it("FormDescriptionが適切なスタイルで表示されること", () => {
    render(<TestForm />);
    const description = screen.getByText("Test Description");
    expect(description).toHaveClass("text-sm", "text-muted-foreground");
  });

  it("FormMessageが適切なスタイルで表示されること", () => {
    render(<TestForm />);
    const message = screen.getByText("Test Message");
    expect(message).toHaveClass("text-sm", "font-medium");
  });

  it("FormItemが適切なスペーシングを持つこと", () => {
    render(<TestForm />);
    const formItem = screen.getByText("Test Label").closest("div");
    expect(formItem).toHaveClass("space-y-2");
  });

  it("FormControlが適切なARIAプロパティを持つこと", () => {
    render(<TestForm />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby");
  });
});
