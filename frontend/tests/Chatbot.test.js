import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../src/Components/chatbot/Chatbot";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        choices: [{ message: { content: "Hello, how can I help?" } }],
      }),
  })
);

describe("Chatbot Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders the chatbot icon", () => {
    render(<Chatbot />);
    const chatbotIcon = screen.getByText("💬");
    expect(chatbotIcon).toBeInTheDocument();
  });

  test("should toggle chatbot window when the icon is clicked", () => {
    render(<Chatbot />);

    const chatbotIcon = screen.getByText("💬");
    fireEvent.click(chatbotIcon);

    const chatbotWindow = screen.getByText("Chat with AI");
    expect(chatbotWindow).toBeInTheDocument();

    // Close the window
    const closeButton = screen.getByText("✖");
    fireEvent.click(closeButton);

    expect(chatbotWindow).not.toBeInTheDocument();
  });

  test("should display login page if token is not present", () => {
    sessionStorage.removeItem("TOKEN");

    const navigate = useNavigate();
    render(<Chatbot />);

    expect(navigate).toHaveBeenCalledWith("/login");
  });

  test("should send a message and display a response", async () => {
    sessionStorage.setItem("TOKEN", "valid-token");

    render(<Chatbot />);

    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hi" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    await waitFor(() => {
      const botMessage = screen.getByText("Hello, how can I help?");
      expect(botMessage).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: expect.any(String),
      })
    );
  });

  test("should update input field when user types", () => {
    render(<Chatbot />);
    const input = screen.getByPlaceholderText("Type your message...");

    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  test("should not send message if input is empty", () => {
    sessionStorage.setItem("TOKEN", "valid-token");

    render(<Chatbot />);

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    expect(fetch).not.toHaveBeenCalled();
  });
});
