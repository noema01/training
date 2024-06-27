import { gql } from '@apollo/client';

export const spacexQ = gql`
    query ExampleQuery {
        company {
            ceo
        }
        roadster {
            apoapsis_au
        }
    }
`;
