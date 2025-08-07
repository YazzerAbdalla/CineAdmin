import { useReducer, useState } from "react";
import { useDebounce } from "react-use";

interface MovieReducerState {
  genre: string;
  searchTerm: string;
  selectedYear: string;
}

interface MovieReducerAction {
  type: "setGenre" | "setSearchTerm" | "setSelectedYear";
  payload: string;
}

const movieFilterReducer = (
  state: MovieReducerState,
  action: MovieReducerAction
): MovieReducerState => {
  switch (action.type) {
    case "setGenre":
      return { ...state, genre: action.payload };
    case "setSearchTerm":
      return { ...state, searchTerm: action.payload };
    case "setSelectedYear":
      return { ...state, selectedYear: action.payload };
    default:
      return state;
  }
};

const initialState = {
  genre: "",
  searchTerm: "",
  selectedYear: "",
};

const useMovieFilters = () => {
  const [state, dispatch] = useReducer(movieFilterReducer, initialState);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    state.searchTerm
  );

  useDebounce(() => setDebouncedSearchTerm(state.searchTerm), 800, [
    state.searchTerm,
  ]);

  return {
    ...state,
    debouncedSearchTerm,
    dispatch,
  };
};

export default useMovieFilters;
