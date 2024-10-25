// userOrderExists.test.ts

import { userOrderExists } from "@/app/actions/orders";
import db from "@/db/db";

// Mock the database
jest.mock("@/db/db", () => ({
    order: {
        findFirst: jest.fn(),
    },
}));

describe("userOrderExists", () => {
    const mockEmail = "test@example.com";
    const mockProductId = "product-123";

    beforeEach(() => {
        // Clear previous mock calls and results
        (db.order.findFirst as jest.Mock).mockClear();
    });

    it("should return true if an order exists for the given email and productId", async () => {
        (db.order.findFirst as jest.Mock).mockResolvedValue({ id: "order-123" });

        const result = await userOrderExists(mockEmail, mockProductId);

        expect(result).toBe(true);
        expect(db.order.findFirst).toHaveBeenCalledWith({
            where: { user: { email: mockEmail }, productId: mockProductId },
            select: { id: true },
        });
    });

    it("should return false if no order exists for the given email and productId", async () => {
        (db.order.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await userOrderExists(mockEmail, mockProductId);

        expect(result).toBe(false);
    });
});
