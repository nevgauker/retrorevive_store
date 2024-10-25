import { emailOrderHistory } from "@/actions/orders";
import db from "@/db/db";
import { Resend } from "resend";

jest.mock("@/db/db", () => ({
    user: { findUnique: jest.fn() },
    downloadVerification: { create: jest.fn() },
}));

jest.mock("resend", () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn(),
        },
    })),
}));

describe("emailOrderHistory", () => {
    const mockEmail = "test@example.com";
    const resend = new Resend(process.env.RESEND_API_KEY as string);

    const validFormData = new FormData();
    validFormData.append("email", mockEmail);

    const invalidFormData = new FormData();
    invalidFormData.append("email", "invalid-email");

    it("should return an error if the email is invalid", async () => {
        const result = await emailOrderHistory(null, invalidFormData, resend);
        expect(result).toEqual({ error: "Invalid email address" });
    });

    it("should return a success message if no user is found in the database", async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await emailOrderHistory(null, validFormData, resend);
        expect(result).toEqual({
            message:
                "Check your email to view your order history and download your products.",
        });
    });

    it("should send an order history email if the user has orders", async () => {
        // Mock user with orders
        (db.user.findUnique as jest.Mock).mockResolvedValue({
            email: mockEmail,
            orders: [
                {
                    id: "order-1",
                    pricePaidInCents: 1000,
                    createdAt: new Date(),
                    product: {
                        id: "product-1",
                        name: "Product 1",
                        imagePath: "/path/to/image.jpg",
                        description: "Description of Product 1",
                    },
                },
            ],
        });

        // Mock downloadVerification.create
        (db.downloadVerification.create as jest.Mock).mockResolvedValue({
            id: "verification-1",
        });

        // Mock Resend email send
        (resend.emails.send as jest.Mock).mockResolvedValue({});

        const result = await emailOrderHistory(null, validFormData, resend);

        expect(resend.emails.send).toHaveBeenCalledWith({
            from: `Support <${process.env.SENDER_EMAIL}>`,
            to: mockEmail,
            subject: "Order History",
            react: expect.anything(), // Since it's a React component, we use a generic matcher here
        });

        expect(result).toEqual({
            message:
                "Check your email to view your order history and download your products.",
        });
    });

    it("should return an error if sending email fails", async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValue({
            email: mockEmail,
            orders: [
                {
                    id: "order-1",
                    pricePaidInCents: 1000,
                    createdAt: new Date(),
                    product: {
                        id: "product-1",
                        name: "Product 1",
                        imagePath: "/path/to/image.jpg",
                        description: "Description of Product 1",
                    },
                },
            ],
        });

        (db.downloadVerification.create as jest.Mock).mockResolvedValue({
            id: "verification-1",
        });

        // Simulate an error from the resend API
        (resend.emails.send as jest.Mock).mockResolvedValue({ error: "Email failed" });

        const result = await emailOrderHistory(null, validFormData, resend);

        expect(result).toEqual({
            error: "There was an error sending your email. Please try again.",
        });
    });
});
