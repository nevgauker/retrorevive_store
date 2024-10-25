import { deleteUser } from "@/app/admin/_actions/users";
import db from "@/db/db"; // Import the mocked database
import { notFound } from "next/navigation"; // Import the notFound function

jest.mock("@/db/db", () => ({
    user: {
        delete: jest.fn(),
    },
}));

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

describe("deleteUser", () => {
    const userId = "456";

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test to avoid interference
    });

    it("should delete an existing user and return it", async () => {
        const mockUser = { id: userId, name: "Sample User" };

        (db.user.delete as jest.Mock).mockResolvedValue(mockUser); // Mock successful deletion

        const result = await deleteUser(userId);

        expect(db.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
        expect(result).toEqual(mockUser); // Verify the returned user
        expect(notFound).not.toHaveBeenCalled(); // Ensure notFound was not called
    });

    it("should call notFound when the user does not exist", async () => {
        (db.user.delete as jest.Mock).mockResolvedValue(null); // Mock deletion that returns null

        await deleteUser(userId);

        expect(db.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
        expect(notFound).toHaveBeenCalled(); // Verify that notFound was called
    });
});
