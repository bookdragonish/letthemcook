import { formatDate } from "./formatDate";


describe("formatDate", () => {

    it("Creates a new date if date is not set", () => {
        const result = formatDate("");
        expect(result).toMatch(/^\d{2}:\d{2} \d{2}\.\d{2}\.\d{2}$/);
    });

    it("Formats the date correctly", () => {
        const result = formatDate("2025-10-18T14:22:00Z");
        expect(result).toMatch("16:22 18.10.25");
    });

    it("Returns nothing if the input is wrong", () => {
        const result = formatDate("wrongInputThello");
        expect(result).toMatch("");
    });
})