import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({
    uri: 'https://react.eogresources.com/graphql',
});

const webSocketLink = new WebSocketLink({
    uri: `ws://react.eogresources.com/graphql`,
    options: {
        reconnect: true,
    },
});

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    webSocketLink,
    httpLink,
);

const cache = new InMemoryCache();

const client = new ApolloClient({
    cache,
    link,
});

const subscribeLive = async () =>
    await client.subscribe({
        query: gql`
      subscription {
        newMeasurement {
          at
          metric
          value
          unit
        }
      }
    `,
    });

const getLatest = async metric => {
    const last30minData = new Date(new Date().getTime() - 30 * 60000).getTime();
    return await client.query({
        query: gql`
      {
        getMeasurements(
          input: {
            metricName: "${metric}"
            after: ${last30minData}
          }
        ) {
          at
          metric
          value
          unit
        }
      }
    `,
    });
};

export default { client, subscribeLive, getLatest };
