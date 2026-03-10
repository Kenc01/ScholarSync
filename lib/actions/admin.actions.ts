"use server";

import { connectToDatabase } from "@/database/mongoose";
import User from "@/database/models/user.model";
import Book from "@/database/models/book.model";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { serializeData } from "@/lib/utils";

export async function isAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function getAllUsersForAdmin() {
  try {
    if (!(await isAdmin())) throw new Error("Unauthorized");

    await connectToDatabase();

    const users = await User.find().sort({ createdAt: -1 }).lean();
    
    // Enrich users with book counts
    const enrichedUsers = await Promise.all(
      users.map(async (user: any) => {
        const bookCount = await Book.countDocuments({
          $or: [{ userId: user._id.toString() }, { clerkId: user._id.toString() }]
        });
        return {
          ...user,
          bookCount
        };
      })
    );

    return {
      success: true,
      data: serializeData(enrichedUsers),
    };
  } catch (error) {
    console.error("Admin Error:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteUserByAdmin(targetUserId: string) {
  try {
    if (!(await isAdmin())) throw new Error("Unauthorized");

    await connectToDatabase();

    // Don't let admin delete themselves
    const session = await getSession();
    if (session?.userId === targetUserId) {
      throw new Error("You cannot delete your own admin account.");
    }

    await User.findByIdAndDelete(targetUserId);
    
    // Optionally delete their books too
    await Book.deleteMany({ userId: targetUserId });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
