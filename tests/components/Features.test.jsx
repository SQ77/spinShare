import React from "react";
import { render, screen } from "@testing-library/react";
import Features from "../../src/components/Features";
import { ThemeProvider } from "@material-tailwind/react";

describe("Features", () => {
    beforeAll(() => {
        global.scrollTo = vi.fn();
    });

    beforeEach(() => {
        render(
            <ThemeProvider>
                <Features />
            </ThemeProvider>
        );
    });

    it("renders all three accordions", () => {
        expect(screen.getByText("Create, Edit, Delete")).toBeInTheDocument();
        expect(screen.getByText("Add Friends")).toBeInTheDocument();
        expect(
            screen.getByText("Absolute, Ally, Revolution Schedules")
        ).toBeInTheDocument();
    });
});
