import { Inngest } from "inngest";
import User from "../models/user.model.js";
import { ENV } from "./env.js";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "ecommerce-app",
  signingKey: ENV.INNGEST.SIGNING_KEY,
});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" }, // Handle one event at a time
  async ({ event, step }) => {
    const user = await step.run("create-or-update-user", async () => {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const userData = {
        email: email_addresses?.[0]?.email_address || email,
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        imageUrl: image_url,
        clerkId: id,
      };

      // Use upsert to handle both create and update
      const [user, created] = await User.upsert(userData, {
        returning: true,
      });

      return { user, created };
    });

    return user;
  }
);

const updateUser = inngest.createFunction(
  { id: "update-user" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    const user = await step.run("update-user-data", async () => {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const userData = {
        email: email_addresses?.[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        imageUrl: image_url,
      };

      const [updated] = await User.update(userData, {
        where: { clerkId: id },
        returning: true,
      });

      return updated;
    });

    return user;
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    await step.run("delete-user", async () => {
      const { id } = event.data;
      await User.destroy({ where: { clerkId: id } });
      return { deleted: true, clerkId: id };
    });
  }
);

export const functions = [syncUser, updateUser, deleteUserFromDB];