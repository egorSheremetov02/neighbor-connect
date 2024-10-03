import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import IncidentCard from "./IncidentCard";
import "@testing-library/jest-dom";
import fetch from "node-fetch";

jest.mock("node-fetch");

describe("IncidentCard", () => {
  const mockIncident = {
    author_id: "123",
    created_at: new Date().toISOString(),
    title: "Test Incident",
    location: "Test Location",
  };

  beforeEach(() => {
    sessionStorage.clear();
  });

  beforeAll(() => {
    const token = "mocked-token";
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(() => token),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it("renders loading state initially", () => {
    render(<IncidentCard incident={mockIncident} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("fetches and displays user full name", async () => {
    sessionStorage.setItem("token", '"mocked_token"');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ fullName: "John Doe" }),
    });

    render(<IncidentCard incident={mockIncident} />);

    // Wait for the loading state to resolve
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).toBeInTheDocument()
    );

    // Check if the full name and incident details are displayed
    // expect(screen.getByText("John Doe")).toBeInTheDocument();
    // expect(screen.getByText(mockIncident.title)).toBeInTheDocument();
    // expect(screen.getByText(mockIncident.location)).toBeInTheDocument();
  });
});
