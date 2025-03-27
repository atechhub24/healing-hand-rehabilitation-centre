import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Generate a URL for file upload
 */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

/**
 * Save the storage ID and file metadata after upload
 */
export const saveStorageId = mutation({
  args: {
    storageId: v.string(),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    patientId: v.string(), // Required patient ID for each file
    tags: v.array(v.string()), // Array of tags like ["profile", "operation", "xray", etc.]
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("files", {
      storageId: args.storageId,
      userId: "public",
      patientId: args.patientId,
      tags: args.tags,
      uploadedAt: Date.now(),
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
    });
  },
});

/**
 * Get the URL for a file
 */
export const getFileUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/**
 * Get files by patient ID and optional tag
 */
export const getFilesByPatient = mutation({
  args: {
    patientId: v.string(),
    tag: v.optional(v.string()), // Optional tag to filter by
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("patientId"), args.patientId));

    // If tag is provided, filter by it
    if (args.tag) {
      const files = await query.collect();
      return files.filter((file) => file.tags.includes(args.tag!));
    }

    return await query.collect();
  },
});
