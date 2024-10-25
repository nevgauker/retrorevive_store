import { deleteOrder } from "@/app/admin/_actions/orders";
import db from "@/db/db"; // Adjust the import based on your structure
import { notFound } from "next/navigation";

jest.mock("@/db/db", () => ({
    order: {
        delete: jest.fn(),
    },
}));

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

describe("deleteOrder", () => {
    const orderId = "123";

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test to avoid interference
    });

    it("should delete an existing order and return it", async () => {
        const mockOrder = { id: orderId, product: "Sample Product" };

        (db.order.delete as jest.Mock).mockResolvedValue(mockOrder); // Mock successful deletion

        const result = await deleteOrder(orderId);

        expect(db.order.delete).toHaveBeenCalledWith({ where: { id: orderId } });
        expect(result).toEqual(mockOrder); // Verify the returned order
        expect(notFound).not.toHaveBeenCalled(); // Ensure notFound was not called
    });

    it("should call notFound when the order does not exist", async () => {
        (db.order.delete as jest.Mock).mockResolvedValue(null); // Mock deletion that returns null

        await deleteOrder(orderId);

        expect(db.order.delete).toHaveBeenCalledWith({ where: { id: orderId } });
        expect(notFound).toHaveBeenCalled(); // Verify that notFound was called
    });
});
