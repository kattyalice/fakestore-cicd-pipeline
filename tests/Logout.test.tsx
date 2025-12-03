import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Logout from "../src/pages/Logout";
import { signOut } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
  getAuth: () => ({})
}));

describe("Logout Component", () => {
  test("renders Logout text", () => {
    render(<Logout />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("calls signOut on mount", () => {
    render(<Logout />);
    expect(signOut).toHaveBeenCalled();
  });
});