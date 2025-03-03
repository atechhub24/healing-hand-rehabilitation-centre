import { auth, database } from "@/lib/firebase";
import { ref, remove, set, push, update } from "firebase/database";

/**
 * Generates system information for audit tracking
 * @returns Object containing system and user information
 */
const generateSystemInfo = () => {
  const timestamp = new Date().toISOString();
  const actionBy = auth.currentUser?.uid;
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const browser = (() => {
    const ua = userAgent;
    if (ua.indexOf("Firefox") > -1) return "Firefox";
    if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "Opera";
    if (ua.indexOf("Chrome") > -1) return "Chrome";
    if (ua.indexOf("Safari") > -1) return "Safari";
    if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1)
      return "Internet Explorer";
    return "Unknown";
  })();

  return {
    timestamp,
    actionBy,
    userAgent,
    platform,
    language,
    screenResolution,
    browser,
  };
};

/**
 * Result interface for mutate operations
 */
interface MutateResult {
  success: boolean;
  id?: string | null;
  path?: string;
  error?: string;
}

/**
 * Mutate data in Firebase Realtime Database
 * @param path - Path to the data in the database
 * @param data - Data to mutate
 * @param action - Action to perform (create, update, delete, createWithId)
 * @returns Promise with the result of the operation
 */
export default async function mutate({
  path,
  data = {},
  action = "update",
}: {
  path: string;
  data?: Record<string, unknown>;
  action: "create" | "update" | "delete" | "createWithId";
}): Promise<MutateResult> {
  try {
    const systemInfo = generateSystemInfo();
    const dbRef = ref(database, path);

    // Clean up the data to remove undefined and null values
    const cleanData = data
      ? Object.entries(data).reduce((acc, [key, value]) => {
          // Only include defined and non-null values
          if (value !== undefined && value !== null) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, unknown>)
      : {};

    switch (action) {
      case "create":
        await set(dbRef, { ...cleanData, creatorInfo: systemInfo });
        return { success: true, path };
      case "createWithId":
        const newRef = await push(dbRef, {
          ...cleanData,
          creatorInfo: systemInfo,
        });
        return { success: true, id: newRef.key, path };
      case "update":
        await update(dbRef, { ...cleanData, updaterInfo: systemInfo });
        return { success: true, path };
      case "delete":
        await remove(dbRef);
        return { success: true, path };
      default:
        throw new Error("Invalid action type");
    }
  } catch (error) {
    console.error(`Database operation failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      path,
    };
  }
}
