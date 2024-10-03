// OfferCard.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import OfferCard from "./offerCard"; // Adjust the path as necessary
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";

// Mocking the fetch function to prevent actual API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ fullName: "John Doe" }),
  })
);

describe("OfferCard Component", () => {
  const offer = {
    author_id: "1",
    title: "Delicious Burger",
    description: "A tasty burger with fresh ingredients.",
    price: "5.99",
    product: "Burger",
    date: new Date().toISOString(), // Current date in ISO format
  };

  beforeAll(() => {
    // Set a mock token in sessionStorage
    sessionStorage.setItem("token", JSON.stringify("mockToken"));
  });

  afterAll(() => {
    // Clear the sessionStorage after tests
    sessionStorage.clear();
  });

  test("renders loading state initially", () => {
    render(<OfferCard offer={offer} />);

    // Check for loading text
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays user name, offer details, and buttons after loading", async () => {
    // Wait for the component to update after fetching
    await act(async () => {
      render(<OfferCard offer={offer} />);
    });

    // Wait for loading to finish
    const loadingText = screen.queryByText(/loading/i);
    expect(loadingText).not.toBeInTheDocument();

    // Check if the full name is rendered
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();

    // Check if offer details are displayed correctly
    expect(screen.getByText(/delicious burger/i)).toBeInTheDocument();
    expect(
      screen.getByText(/a tasty burger with fresh ingredients/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/price: 5.99/i)).toBeInTheDocument();
    expect(screen.getByText(/product: burger/i)).toBeInTheDocument();

    // Check for formatted date
    const dateTime = new Date(offer.date);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedDateTime = dateTime.toLocaleDateString("en-US", options);
    // expect(screen.getByText(new RegExp(formattedDateTime))).toBeInTheDocument();

    // Check if buttons are displayed
    expect(screen.getByText("Like")).toBeInTheDocument();
    expect(screen.getByText("dislike")).toBeInTheDocument();
    expect(screen.getByText(/go to seller page/i)).toBeInTheDocument();
  });
});
