import {
    GraphQLServer
} from 'graphql-yoga'

import { v4 as uuidv4 } from "uuid";

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

    type Mutation {
   
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }


    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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

    Mutation:{
        createUser(parent, args, ctx, info){
            const emailTaken = users.some((user) => user.email === args.email)
            if(emailTaken){
                throw new Error('Email already in use')
            }
            const user={
                id : uuidv4(),
                // name : args.name,
                // email : args.email,
                // age : args.age,
                ...args

            }
            users.push(user)
            return user
        },
        // createPost(parent, agrs, ctx, info){

        // }


    deleteUser(parent, args, ctx, info) {
        const userIndex = users.findIndex((user) => user.id === args.id)

        if (userIndex === -1) {
            throw new Error('User not found')
        }

        const deletedUsers = users.splice(userIndex, 1)

        // posts = posts.filter((post) => {
        //     const match = post.author === args.id

        //     if (match) {
        //         comments = comments.filter((comment) => comment.post !== post.id)
        //     }

        //     return !match
        // })
        // comments = comments.filter((comment) => comment.author !== args.id)

        return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
        const userExists = users.some((user) => user.id === args.data.author)

        if (!userExists) {
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        posts.push(post)

        return post
    },
    deletePost(parent, args, ctx, info) {
        const postIndex = posts.findIndex((post) => post.id === args.id)
        
        if (postIndex === -1) {
            throw new Error('Post not found')
        }

        const deletedPosts = posts.splice(postIndex, 1)

        // comments = comments.filter((comment) => comment.post !== args.id)

        return deletedPosts[0]
    },
    createComment(parent, args, ctx, info){
        const userExists = users.some((user) => user.id === args.data.author)
        const postExists = posts.some((post) => post.id === args.data.post && post.published)

        if (!userExists || !postExists) {
            throw new Error('Unable to find user and post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        comments.push(comment)

        return comment
    },
    deleteComment(parent, args, ctx, info) {
        const commentIndex = comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found')
        }

        const deletedComments = comments.splice(commentIndex, 1)

        return deletedComments[0]
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