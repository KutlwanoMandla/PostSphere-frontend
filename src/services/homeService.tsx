const API_URL = 'https://postsphere-backend-1.onrender.com/api/'; // Replace with your actual backend URL

// Function to fetch all users with Bearer token using fetch
export const fetchAllUsers = async (token: string) => {
  try {
    const response = await fetch(API_URL + 'users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};