import { render, screen } from "@testing-library/react";
import Hero from "../../src/components/Hero";
import React from "react";

describe("Hero", () => {
    it("renders the hero section with correct text", () => {
        render(<Hero />);

        // Check if the heading is present
        expect(
            screen.getByRole("heading", { name: /SpinShare/i })
        ).toBeInTheDocument();

        // Check if the description text is present
        expect(screen.getByText(/Create and Share/i)).toBeInTheDocument();
    });
});
