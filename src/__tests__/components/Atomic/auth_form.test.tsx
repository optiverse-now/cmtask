import { render, fireEvent, screen } from '@testing-library/react';
import { AuthForm } from '@/app/components/Atomic/auth_form';

describe('AuthForm', () => {
  const mockOnSubmit = jest.fn();
  const submitText = 'Submit';

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders children and submit button', () => {
    render(
      <AuthForm onSubmit={mockOnSubmit} submitText={submitText}>
        <div>Test Content</div>
      </AuthForm>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText(submitText)).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', () => {
    render(
      <AuthForm onSubmit={mockOnSubmit} submitText={submitText}>
        <div>Test Content</div>
      </AuthForm>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <AuthForm onSubmit={mockOnSubmit} submitText={submitText} isLoading>
        <div>Test Content</div>
      </AuthForm>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText(submitText)).not.toBeInTheDocument();
  });
}); 