import axios from "axios";

const baseUrl = (movieId: number) =>
  `${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/ratings`;

export const fetchUserRating = async (movieId: number, token: string) => {
  try {
    if (!movieId || !token || typeof movieId !== "number") {
      throw new Error("Some props are missing.");
    }
    const url = baseUrl(movieId);
    const result = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error) {
    console.error("Some thing went wrong while fetch user rating.", error);
    throw error;
  }
};

export const createUserRating = async (
  movieId: number,
  token: string,
  rating: number
) => {
  try {
    if (
      !movieId ||
      !token ||
      typeof movieId !== "number" ||
      typeof rating !== "number" ||
      !rating
    ) {
      throw new Error("Some props are missing.");
    }
    const url = baseUrl(movieId);
    const newRating = { rating };
    const result = await axios.post(url, newRating, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error) {
    console.error("Some thing went wrong while create user rating.", error);
    throw error;
  }
};

export const updateUserRating = async (
  ratingId: number,
  rating: number,
  token: string
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/ratings/${ratingId}`;
    const newRating = { rating };
    const { data } = await axios.put(url, newRating, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Some thing went wrong while updating user rating.", error);
    throw error;
  }
};
