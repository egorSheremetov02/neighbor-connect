import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "./Profile";
import "@testing-library/jest-dom";

describe("Profile Component", () => {
  beforeEach(() => {
    render(<Profile />);
  });

  test("renders profile image", () => {
    const profileImage = screen.getByTestId("profileimageid");
    expect(profileImage).toBeInTheDocument();
  });

  test("renders user name", () => {
    const userName = screen.getAllByText("Ahmed");
    expect(userName.length).toEqual(2);
  });

  test("renders user title", () => {
    const userTitle = screen.getByText("Owner at Her Company Inc.");
    expect(userTitle).toBeInTheDocument();
  });

  test("renders user description", () => {
    const userDescription = screen.getByText(/Lorem ipsum dolor sit amet/);
    expect(userDescription).toBeInTheDocument();
  });

  test("renders status", () => {
    const status = screen.getByText("Active");
    expect(status).toBeInTheDocument();
  });

  test("renders member since date", () => {
    const memberSince = screen.getByText("Nov 07, 2016");
    expect(memberSince).toBeInTheDocument();
  });

  test("renders about section header", () => {
    const aboutHeader = screen.getByText("About");
    expect(aboutHeader).toBeInTheDocument();
  });

  test("renders button to toggle full information", () => {
    const toggleButton = screen.getByRole("button", {
      name: /Show Full Information/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });
});
