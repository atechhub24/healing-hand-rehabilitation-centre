const authUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_URL;
const authKey = process.env.NEXT_PUBLIC_FIREBASE_AUTH_KEY;

export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await fetch(
      `${authUrl}:signInWithPassword?key=${authKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: currentPassword }),
      }
    );
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    const idToken = data.idToken;
    const changePasswordResponse = await fetch(
      `${authUrl}:changePassword?key=${authKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, password: newPassword }),
      }
    );
    const changePasswordData = await changePasswordResponse.json();
    return changePasswordData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
