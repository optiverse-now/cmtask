import { renderHook, act } from "@testing-library/react";
import { useTaskForm } from "@/app/hooks/useTaskForm";
import { VALIDATION_MESSAGES } from "@/constants/messages";

describe("useTaskForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("初期状態が正しく設定されている", () => {
    const { result } = renderHook(() => useTaskForm(mockOnSubmit));

    expect(result.current.formState).toEqual({
      title: "",
      description: "",
      assignee: "",
      dueDate: expect.any(Date),
      priority: "中",
    });
    expect(result.current.errors).toEqual({});
  });

  it("フィールドの更新が正しく動作する", () => {
    const { result } = renderHook(() => useTaskForm(mockOnSubmit));

    act(() => {
      result.current.updateField("title", "テストタスク");
      result.current.updateField("description", "テスト説明");
      result.current.updateField("assignee", "テストユーザー");
    });

    expect(result.current.formState.title).toBe("テストタスク");
    expect(result.current.formState.description).toBe("テスト説明");
    expect(result.current.formState.assignee).toBe("テストユーザー");
  });

  it("バリデーションエラーが正しく設定される", () => {
    const { result } = renderHook(() => useTaskForm(mockOnSubmit));

    act(() => {
      result.current.handleSubmit("test-project-id");
    });

    expect(result.current.errors).toEqual({
      title: VALIDATION_MESSAGES.REQUIRED,
      description: VALIDATION_MESSAGES.REQUIRED,
      assignee: VALIDATION_MESSAGES.REQUIRED,
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("フォームが正しく送信される", () => {
    const { result } = renderHook(() => useTaskForm(mockOnSubmit));

    act(() => {
      result.current.updateField("title", "テストタスク");
    });

    act(() => {
      result.current.updateField("description", "テスト説明");
    });

    act(() => {
      result.current.updateField("assignee", "テストユーザー");
    });

    act(() => {
      result.current.handleSubmit("test-project-id");
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      "test-project-id",
      "テストタスク",
      "テスト説明",
      "テストユーザー",
      expect.any(Date),
      "中",
    );
  });

  it("フォームがリセットされる", () => {
    const { result } = renderHook(() => useTaskForm(mockOnSubmit));

    act(() => {
      result.current.updateField("title", "テストタスク");
      result.current.updateField("description", "テスト説明");
      result.current.resetForm();
    });

    expect(result.current.formState).toEqual({
      title: "",
      description: "",
      assignee: "",
      dueDate: expect.any(Date),
      priority: "中",
    });
    expect(result.current.errors).toEqual({});
  });
});
