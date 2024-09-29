const { ApolloServer } = require('apollo-server');
const { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { RemoteTransformGraphQLDataSource } = require('@jeff-tian/graphql-transform-federation/dist/remote-transform-graphql-datasource.js');

const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            { name: 'user-service', url: 'https://brickpets-user-service-latest-3q8s.onrender.com/graphql' },
            { name: 'cms', url: 'https://strapi.brickverse.dev/graphql' },
        ],
    }),
    buildService: ({ name, url }) => {
        if (name === 'cms') {
            return new RemoteTransformGraphQLDataSource(
                url,
                process.env.CMS_TOKEN
            );
        }

        return new RemoteGraphQLDataSource({ url });
    },
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
    gateway,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
