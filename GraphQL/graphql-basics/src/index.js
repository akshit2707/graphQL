import {
    GraphQLServer
} from 'graphql-yoga'

//schema goes here

const users = [{
    id: '1',
    name: 'Akshit',
    email: 'aks@gmail.com',
    age: 23
}, {
    id: '2',
    name: 'Mohit',
    email: 'moh@xyz.com'
}, {
    id: '3',
    name: 'Srija',
    email: 'srija@yahoo.com'
}]

const posts = [{
    id: '10',
    title: 'Book 1',
    body: 'New book released ',
    published: true,
    author: '1'
}, {
    id: '11',
    title: 'Book 2',
    body: 'Old book renewed',
    published: false,
    author: '1'
}, {
    id: '12',
    title: 'Second hand',
    body: '',
    published: false,
    author: '2'
}]

const comments = [{
    id: '102',
    text: 'Good book',
    author: '3',
    post: '10'
}, {
    id: '103',
    text: 'Old book',
    author: '1',
    post: '10'
}, {
    id: '104',
    text: 'Can be improved',
    author: '2',
    post: '11'
}, {
    id: '105',
    text: 'Four star',
    author: '1',
    post: '11'
}]


//typedef goes here
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// resolver goes here
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        comments(parent, args, ctx, info) {
            return comments
        },
        me() {
            return {
                id: '123098',
                name: 'Akshit',
                email: 'aks@gmail.com'
            }
        },
        post() {
            return {
                id: '092',
                title: 'Brand new book',
                body: '',
                published: false
            }
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    }
}


//server goes here

const server = new GraphQLServer({
        typeDefs,
        resolvers
    }

)


server.start(() => {
    console.log("Server started")
})