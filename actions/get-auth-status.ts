"use server";

import { db } from "@/lib";
import { currentUser } from "@clerk/nextjs/server";

const getAuthStatus = async () => {
  const user = await currentUser();

  if (!user?.id || !user.emailAddresses?.[0]?.emailAddress) {
    return { error: "User not found" };
  }

  let clerkId = user.id;
  const email = user.emailAddresses[0].emailAddress;

  const existingUser = await db.user.findFirst({
    where: { clerkId },
  });

  console.log("existingUser", existingUser);

  if (!existingUser) {
    await db.user.create({
      data: {
        clerkId,
        email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.imageUrl,
      },
    });
  }

  return { success: true };
};

export default getAuthStatus;
