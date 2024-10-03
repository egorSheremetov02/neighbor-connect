import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Chats from "./Chats"; // Adjust the path as necessary
import "@testing-library/jest-dom";

describe("Chats Component", () => {
  beforeEach(() => {
    render(<Chats />);
  });

  it("renders the header with the title", () => {
    expect(screen.getByText("GoingChat")).toBeInTheDocument();
  });

  it("allows the user to type in the message input", () => {
    const input = screen.getByPlaceholderText("type your message here...");
    expect(input).toBeInTheDocument();

    // Simulate typing in the input
    fireEvent.change(input, { target: { value: "Hello, World!" } });
    expect(input.value).toBe("Hello, World!");
  });
});
