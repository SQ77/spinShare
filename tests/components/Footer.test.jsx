import { render, screen } from "@testing-library/react";
import Footer from "../../src/components/Footer";
import React from "react";

describe("Footer", () => {
    it("renders Footer with correct text", () => {
        render(<Footer />);

        const footerText = screen.getByText(
            /2024 SpinShare. All rights reserved./i
        );
        expect(footerText).toBeInTheDocument();
    });
});
