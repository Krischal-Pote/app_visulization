import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query {
    countries {
      code
      name
      continent {
        name
      }
      languages {
        name
      }
    }
  }
`;

export const GET_CONTINENTS = gql`
  query {
    continents {
      code
      name
    }
  }
`;
