import { gql } from "apollo-boost";

export const moviesQuery = gql`
  query movieQuery {
    movies {
      id
      name
      genre
      watched
      rate
      director {
        name
        id
      }
    }
  }
`;