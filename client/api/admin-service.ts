/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import toast from "react-hot-toast";
import { IUser, UserRoles } from "@/types/AuthProps";
import { AdminQueryProps } from "@/types/query";
import { IMovie, IMovieInArray } from "@/types/movies";
import { IStats } from "@/types/AdminPageProps";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin`;

const createHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Generic GET request
const getRequest = async <T>(url: string, token: string): Promise<any> => {
  try {
    const { data } = await axios.get<T>(url, createHeaders(token));
    return data; // return full object
  } catch (err: any) {
    toast.error(err?.response?.data?.message || err.message);
  }
};

// Generic DELETE request
const deleteRequest = async <T>(
  url: string,
  token: string
): Promise<T | undefined> => {
  try {
    const { data } = await axios.delete<T>(url, createHeaders(token));
    return data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || err.message);
  }
};

// Generic PUT request

const putRequest = async <T>(
  url: string,
  token: string,
  body?: unknown
): Promise<any> => {
  try {
    const { data } = await axios.put<T>(url, body, createHeaders(token));
    return data; // return full object
  } catch (err: any) {
    toast.error(err?.response?.data?.message || err.message);
  }
};

// ==============================
// Admin API Functions
// ==============================

export const fetchAppStatistics = async (
  token: string
): Promise<IStats | undefined> => {
  const response = await getRequest<IStats>(`${baseUrl}/statistics`, token);
  return response?.data;
};

export const fetchAllUsers = async (
  token: string
): Promise<IUser[] | undefined> => {
  const response = await getRequest<IUser[]>(`${baseUrl}/users`, token);
  return response?.data;
};

export const fetchAllMovies = async (
  token: string,
  query?: AdminQueryProps
): Promise<IMovieInArray[] | undefined> => {
  let url = `${baseUrl}/movies`;
  if (query) {
    const params = new URLSearchParams(
      Object.entries(query).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    url += `?${params}`;
  }

  const response = await getRequest<IMovie[]>(url, token);
  return response?.data;
};

export const fetchAllComments = async (
  token: string
): Promise<any[] | undefined> => {
  const response = await getRequest<any[]>(`${baseUrl}/comments`, token);
  return response?.data;
};

export const deleteUser = async (token: string, userId: number) => {
  return await deleteRequest(`${baseUrl}/users/${userId}`, token);
};

export const deleteMovie = async (token: string, movieId: number) => {
  return await deleteRequest(`${baseUrl}/movies/${movieId}`, token);
};

export const deleteComment = async (token: string, commentId: number) => {
  return await deleteRequest(`${baseUrl}/comments/${commentId}`, token);
};

export const updateUserRole = async (
  token: string,
  newRole: UserRoles,
  userId: number
): Promise<IUser | undefined> => {
  const response = await putRequest<IUser>(
    `${baseUrl}/users/${userId}/role`,
    token,
    { newRole }
  );
  return response?.data;
};

export const updateMovieStatus = async (
  token: string,
  status: boolean,
  movieId: number
): Promise<IMovie | undefined> => {
  const response = await putRequest<IMovie>(
    `${baseUrl}/movies/${movieId}/status/${status}`,
    token
  );
  return response?.data;
};
