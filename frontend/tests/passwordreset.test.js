import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '../src/Pages/PasswordReset.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { login: 'testuser@example.com' } }),
}));

global.fetch = jest.fn();

const mockSessionStorage = {
  setItem: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

describe('ResetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders ResetPassword component', () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Verification Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verify Code' })).toBeInTheDocument();
  });

  test('displays error message when form is submitted without code', async () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Verify Code' }));
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    });
  });

  test('handles successful password reset', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: 'test_token', user_id: 1 }),
    });

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    
    const codeInput = screen.getByLabelText('Verification Code');
    const submitButton = screen.getByRole('button', { name: 'Verify Code' });
    
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('You have successfully logged in! Redirecting to home...')).toBeInTheDocument();
    });

    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('TOKEN', JSON.stringify('test_token'));
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('myid', JSON.stringify(1));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    }, { timeout: 4000 });
  });

  test('handles failed password reset', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Invalid verification code' }),
    });

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    
    const codeInput = screen.getByLabelText('Verification Code');
    const submitButton = screen.getByRole('button', { name: 'Verify Code' });
    
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid verification code')).toBeInTheDocument();
    });
  });

  test('handles network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    
    const codeInput = screen.getByLabelText('Verification Code');
    const submitButton = screen.getByRole('button', { name: 'Verify Code' });
    
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
    });
  });
});