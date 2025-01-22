import { auth, database } from "@/lib/firebase";
import { ref, remove, set, update } from "firebase/database";

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
export default async function mutate({
  path,
  data = {},
  action = "update",
}: {
  path: string;
  data?: Record<string, any>;
  action: "create" | "update" | "delete";
}) {
  const systemInfo = generateSystemInfo();
  const db = database;
  const dbRef = ref(db, path);

  switch (action) {
    case "create":
      await set(dbRef, { ...data, creatorInfo: systemInfo });
      break;
    case "update":
      await update(dbRef, { ...data, updaterInfo: systemInfo });
      break;
    case "delete":
      await remove(dbRef);
      break;
    default:
      throw new Error("Invalid action type");
  }
}
