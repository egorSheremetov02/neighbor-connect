// AddOffer.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddOffer from "./AddOffer";

// Mocking the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ offer_id: 123 }),
  })
);

describe("AddOffer Component", () => {
  beforeEach(() => {
    render(<AddOffer />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders form elements", () => {
    expect(screen.getByLabelText(/Offer Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("handles input changes", () => {
    fireEvent.change(screen.getByLabelText(/Offer Title/i), {
      target: { value: "New Offer" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "This is a great offer." },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2024-10-10" },
    });
    fireEvent.change(screen.getByLabelText(/Product/i), {
      target: { value: "Food Items" },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "10" },
    });

    expect(screen.getByLabelText(/Offer Title/i).value).toBe("New Offer");
    expect(screen.getByLabelText(/Description/i).value).toBe(
      "This is a great offer."
    );
    expect(screen.getByLabelText(/Date/i).value).toBe("2024-10-10");
    expect(screen.getByLabelText(/Product/i).value).toBe("Food Items");
    expect(screen.getByLabelText(/Price/i).value).toBe("10");
  });
});
