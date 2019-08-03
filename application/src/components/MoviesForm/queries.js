import { gql } from "apollo-boost";

export const directorsQuery = gql`
    query movieQuery {
        directors {
            id
            name
        }
    }
`;