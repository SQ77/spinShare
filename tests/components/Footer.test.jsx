import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../../src/components/Footer";
import React from "react";
import "@testing-library/jest-dom";

describe("Footer", () => {
    it("renders Footer with correct text", () => {
        render(<Footer />);

        const footerText = screen.getByText(
            /2024 SpinShare. All rights reserved./i
        );
        expect(footerText).toBeInTheDocument();
    });
});
