import type { Profile } from "@/types";
import data from "@/content/profile.json";

export const profile: Profile = {
  ...(data as Omit<Profile, "bookingUrl">),
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || undefined,
};
