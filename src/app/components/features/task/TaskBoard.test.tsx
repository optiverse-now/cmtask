import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskBoard from './TaskBoard';

jest.mock('@/app/contexts/TaskContext', () => ({
  useTask: () => ({
    tasks: {},
    columns: {
      'column-1': { id: 'column-1', title: 'Todo', taskIds: [] },
      'column-2': { id: 'column-2', title: 'In Progress', taskIds: [] },
      'column-3': { id: 'column-3', title: 'Done', taskIds: [] }
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
    selectTask: jest.fn(),
    selectedTaskId: null
  }),
}));

describe('TaskBoard', () => {
  const mockProps = {
    selectedProjectId: '1',
    onAddTask: jest.fn(),
    onTaskMove: jest.fn(),
    onEditTask: jest.fn(),
    projectStatus: 'active'
  };

  it('renders without crashing', () => {
    render(<TaskBoard {...mockProps} />);
    expect(screen.getByText('タスクボード')).toBeInTheDocument();
    expect(screen.getByText('新規タスク')).toBeInTheDocument();
  });
}); 