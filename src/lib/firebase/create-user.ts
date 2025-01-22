const authUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_URL;
const authKey = process.env.NEXT_PUBLIC_FIREBASE_AUTH_KEY;

export const createUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${authUrl}:signUp?key=${authKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
