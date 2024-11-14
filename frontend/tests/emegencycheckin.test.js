import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CheckInComponent from "../src/Pages/EmergencyCheckIn";

describe("CheckInComponent", () => {
  beforeEach(() => {
    render(<CheckInComponent />);
  });

  afterEach(() => {
    cleanup();
  });

  test("renders emergency check-in title and buttons", () => {
    expect(screen.getByText("Emergency")).toBeInTheDocument();
    expect(screen.getByText("Check-In")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "I'm Safe" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "I'm Not Safe" })).toBeInTheDocument();
  });

  test("displays safe status when 'I'm Safe' button is clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: "I'm Safe" }));
    expect(screen.getByText("SAFE")).toBeInTheDocument();
  });

  test("displays danger status when 'I'm Not Safe' button is clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: "I'm Not Safe" }));
    expect(screen.getByText("DANGER")).toBeInTheDocument();
  });

  test("sends alert to selected neighbor", () => {
    // Mock neighbors list
    const mockNeighbors = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    // Mock selecting a neighbor
    fireEvent.click(screen.getByText("Alice"));

    // Simulate alert button click
    fireEvent.click(screen.getByRole("button", { name: /Alert Selected Neighbor/i }));

    // Check if the alert status updates correctly
    expect(screen.getByText("Alert sent to Alice")).toBeInTheDocument();
  });

  test("displays an error if no neighbor is selected and alert is triggered", () => {
    fireEvent.click(screen.getByRole("button", { name: /Alert Selected Neighbor/i }));
    expect(screen.getByText("Please select a neighbor to alert.")).toBeInTheDocument();
  });

  test("displays dynamic status message based on user actions", () => {
    fireEvent.click(screen.getByRole("button", { name: "I'm Safe" }));
    expect(screen.getByText("SAFE")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "I'm Not Safe" }));
    expect(screen.getByText("DANGER")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Alert Selected Neighbor/i }));
    expect(screen.getByText("Please select a neighbor to alert.")).toBeInTheDocument();
  });

  test("ensures alert is only sent to selected neighbor", () => {
    fireEvent.click(screen.getByText("Bob"));
    fireEvent.click(screen.getByRole("button", { name: /Alert Selected Neighbor/i }));
    expect(screen.getByText("Alert sent to Bob")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Alice"));
    fireEvent.click(screen.getByRole("button", { name: /Alert Selected Neighbor/i }));
    expect(screen.getByText("Alert sent to Alice")).toBeInTheDocument();
  });
});
