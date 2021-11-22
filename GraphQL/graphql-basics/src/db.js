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

const db = {
    users,
    posts,
    comments
}

export { db as default }