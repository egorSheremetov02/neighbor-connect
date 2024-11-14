import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import RequestResetCode from "../src/Pages/PasswordRecovery.jsx";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();

describe("RequestResetCode Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component with form elements", () => {
    render(
      <BrowserRouter>
        <RequestResetCode />
      </BrowserRouter>
    );
    expect(screen.getByText(/Request Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Login \(Username or Email\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Reset Code/i })).toBeInTheDocument();
  });

  test("navigates to password reset page on successful submission", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(
      <BrowserRouter>
        <RequestResetCode />
      </BrowserRouter>
    );

    const loginInput = screen.getByLabelText(/Login \(Username or Email\)/i);
    const submitButton = screen.getByRole("button", { name: /Send Reset Code/i });

    fireEvent.change(loginInput, { target: { value: "testuser@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/passwordreset", { state: { login: "testuser@example.com" } });
    });
  });

  test("displays error message on API failure", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: "Failed to send reset code." }),
    });

    render(
      <BrowserRouter>
        <RequestResetCode />
      </BrowserRouter>
    );

    const loginInput = screen.getByLabelText(/Login \(Username or Email\)/i);
    const submitButton = screen.getByRole("button", { name: /Send Reset Code/i });

    fireEvent.change(loginInput, { target: { value: "testuser@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to send reset code.")).toBeInTheDocument();
    });
  });

  test("displays network error on fetch rejection", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <BrowserRouter>
        <RequestResetCode />
      </BrowserRouter>
    );

    const loginInput = screen.getByLabelText(/Login \(Username or Email\)/i);
    const submitButton = screen.getByRole("button", { name: /Send Reset Code/i });

    fireEvent.change(loginInput, { target: { value: "testuser@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network error.")).toBeInTheDocument();
    });
  });
});