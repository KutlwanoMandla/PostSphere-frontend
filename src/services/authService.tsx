interface SignupData {
    username: string;
    email: string;
    bio: string;
    password: string;
  }
  
  interface LoginData {
    username: string;
    password: string;
  }
  
  interface AuthResponse {
    id: String;
    username: string;
    email: string;
    bio: string;
    password: string;
    token: string;
  }
  
  const API_URL = 'https://postsphere-backend-1.onrender.com/api/auth';
  
  export const authService = {
    async signup(data: SignupData): Promise<string> {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      return response.text();
    },
  
    async login(data: LoginData): Promise<AuthResponse> {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
  
      const authData = await response.json();
      // Store the token in localStorage
      localStorage.setItem('token', authData.token);
      return authData;
    },
    forgotPassword: async (email: string) => {
      try {
        const response = await fetch(`${API_URL}/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
  
        const data = await response.text();
        return data; // This will return the full response including the verification code
      } catch (error) {
        throw error;
      }
    },

    async resetPassword(data: { email: string; verificationCode: string; newPassword: string }): Promise<string> {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          verificationCode: data.verificationCode,
          newPassword: data.newPassword
        })
      });
    
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    
      return response.text();
    }
  };