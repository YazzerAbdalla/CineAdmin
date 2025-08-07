/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiErrorHandler } from "@/lib/api-error-handling";
import { RegisterProps } from "@/types/AuthProps";
import axios, { AxiosError } from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export async function loginMethod(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error("There are some fields empty.");
    }
    const url = `${baseUrl}/login`;
    const result = await axios.post(url, { email, password });
    return result.data;
  } catch (error) {
    console.error("Some thing went wrong while user signing in.", error);
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

export async function registerMethod({
  email,
  firstName,
  lastName,
  password,
}: RegisterProps) {
  try {
    if (!email || !password || !firstName || !lastName) {
      throw new Error("There are some fields empty.");
    }
    const url = `${baseUrl}/register`;
    const result = await axios.post(url, {
      email,
      password,
      firstName,
      lastName,
    });
    return result.data;
  } catch (error) {
    console.error("Some thing went wrong while user signing up.", error);
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

export async function fetchUserInfo(token: string) {
  try {
    const url = `${baseUrl}/me`;
    const result = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Something went wrong while fetching user info", error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Unauthorized"); // let AuthProvider handle logout
    }

    throw error;
  }
}

export async function forgotPasswordReq(email: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/forgot-password`;
    const { data } = await axios.post(url, { email });
    return data;
  } catch (error: any) {
    console.error(
      "Some thing went wrong while sending your forgot password request."
    );
    apiErrorHandler(error);
    throw error;
  }
}

export async function resetUserPassword(
  newPassword: string,
  resetPasswordToken: string,
  userId: number
) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password/${userId}/${resetPasswordToken}`;
    const { data } = await axios.post(url, { newPassword });
    return data;
  } catch (error: any) {
    console.error(
      "Some thing went wrong while reset your password request.",
      error
    );
    apiErrorHandler(error);
  }
}
