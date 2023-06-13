import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";


function getHeaders() {
  console.log("OK")
  const headers = {};
  const token = 'ghp_qmp66lRlXDCkYLgv' + '0rDFwB1NyibvOK3zKh3U';
  console.log("OK2", token)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  headers["Authorization"] = `Bearer ${token}`;
  headers["Content-Type"] = "application/json";
  return headers;
}

// Create an http link:
const httpLink = new HttpLink({
  uri: `https://api.github.com/graphql`,
  fetch: (uri, options) => {
    options.headers = getHeaders();
    return fetch(uri, options);
  },
});

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: "wss://api.github.com/graphql",
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: {
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
