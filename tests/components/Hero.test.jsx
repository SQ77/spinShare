import { render, screen } from "@testing-library/react";
import { it, expect, describe } from 'vitest';
import Hero from "../../src/components/Hero";
import React from "react";
import '@testing-library/jest-dom';

describe("Hero Component", () => {
  it("renders the hero section", () => {
    render(<Hero />);
    
    // Check if the heading is present
    expect(screen.getByRole("heading", { name: /SpinShare/i })).toBeInTheDocument();

    // Check if the description text is present
    expect(screen.getByText(/Create and Share your spin schedule/i)).toBeInTheDocument();

  });
});
