import axios, { AxiosError } from "axios";

const baseUrl = (id: number) =>
  `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`;

export const fetchMovieComments = async (id: number) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/movies/${id}/comments/`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    console.error("Error while fetching movie's comments.", error);
    if (error instanceof AxiosError && error.response) {
      throw error.response.data || error.message;
    } else {
      throw error;
    }
  }
};

export const postComment = async (
  movieId: number,
  content: string,
  token: string
) => {
  try {
    if (!movieId || !token || !content) {
      throw new Error("Some missing props found.");
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/comments`;
    const newComment = { content };
    const result = await axios.post(url, newComment, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error) {
    console.error("Some thing went wrong while posting user comment.", error);
    if (error instanceof AxiosError && error.response) {
      throw error.response.data || error.message;
    } else {
      throw error;
    }
  }
};

export const updateUserComment = async (
  commentId: number,
  newContent: string,
  token: string
) => {
  try {
    const url = baseUrl(commentId);
    const { data } = await axios.put(
      url,
      { content: newContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Some thing went wrong while updating user comment.", error);

    if (error instanceof AxiosError && error.response) {
      throw error.response.data || error.message;
    } else {
      throw error;
    }
  }
};

export const removeUserComment = async (commentId: number, token: string) => {
  try {
    const url = baseUrl(commentId);
    const { data } = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Some thing went wrong while deleting user comment.", error);

    if (error instanceof AxiosError && error.response) {
      throw error.response.data || error.message;
    } else {
      throw error;
    }
  }
};
