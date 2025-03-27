import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    storageId: v.string(),
    userId: v.string(),
    patientId: v.string(),
    tags: v.array(v.string()),
    uploadedAt: v.number(),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
  }),
});
