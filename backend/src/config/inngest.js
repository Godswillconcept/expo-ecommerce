import { Inngest } from "inngest";
import User from "../models/user.model.js";
import { getEnv } from "./env.js";


// Create a client to send and receive events
export const inngest = new Inngest({
  id: "ecommerce-app",
  signingKey: getEnv("INGEST_SIGNING_KEY"),
});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: ["clerk/user.created", "clerk/user.updated"] },
  async ({ event, step }) => {
    const { type, data } = event;

    const { id, email, first_name, last_name, image_url } = data;

    const userData = {
      email: email,
      name: `${first_name} ${last_name || ""}` || "User",
      imageUrl: image_url,
      clerkId: id,
    };

    const user = await User.create(userData);

    step.done({ user });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    const { id } = event.data;
    await User.destroy({ where: { clerkId: id } });
  }
);
export const functions = [syncUser, deleteUserFromDB];
