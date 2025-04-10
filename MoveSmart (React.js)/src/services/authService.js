const API_URL = "";

export const loginUser = async (id, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "فشل تسجيل الدخول");

    return data; 
  } catch (error) {
    throw error;
  }
};
