const authUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_URL;
const authKey = process.env.NEXT_PUBLIC_FIREBASE_AUTH_KEY;

export const deleteUser = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `${authUrl}:signInWithPassword?key=${authKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    const idToken = data.idToken;
    const deleteUserResponse = await fetch(
      `${authUrl}:deleteAccount?key=${authKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    const deleteUserData = await deleteUserResponse.json();
    return deleteUserData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
