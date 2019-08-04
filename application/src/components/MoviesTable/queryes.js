import { gql } from "apollo-boost";

export const moviesQuery = gql`
    query movieQuery($name: String) {
        movies(name: $name) {
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