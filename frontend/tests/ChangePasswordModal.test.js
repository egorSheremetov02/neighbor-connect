import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChangePasswordModal from "../src/Components/EditPasswordModal";

describe("ChangePasswordModal", () => {
  const handleCloseMock = jest.fn();

  beforeEach(() => {
    render(<ChangePasswordModal open={true} handleClose={handleCloseMock} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
  });

  test("allows input in password fields", () => {
    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpassword" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpassword" },
    });

    expect(screen.getByLabelText("Current Password")).toHaveValue(
      "oldpassword"
    );
    expect(screen.getByLabelText("New Password")).toHaveValue("newpassword");
    expect(screen.getByLabelText("Confirm New Password")).toHaveValue(
      "newpassword"
    );
  });

  test("shows alert if passwords do not match", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(screen.getByText("Change Password"));

    expect(window.alert).toHaveBeenCalledWith("Passwords do not match.");
  });

  test("calls handleClose on successful password change", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpassword" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpassword" },
    });

    fireEvent.click(screen.getByText("Change Password"));

    await waitFor(() => expect(handleCloseMock).toHaveBeenCalled());
    expect(window.alert).toHaveBeenCalledWith("Password changed successfully");
  });

  test("shows error alert on failed password change", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpassword" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpassword" },
    });

    fireEvent.click(screen.getByText("Change Password"));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Error changing password")
    );
  });
});
