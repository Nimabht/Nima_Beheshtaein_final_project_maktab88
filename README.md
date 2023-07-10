
# Onyx blogging website

This is a full-stack blogging website built with Express.js and EJS, using MongoDB for the database. It provides a platform for users to read and write articles, post comments, and interact with other users. The project also includes an admin panel for managing users, comments, and articles.

## Features

- User Registration and Authentication: Users can create accounts, log in, and log out securely.
- Article Management: Registered users can create, edit, and delete their articles.
- Commenting System: Users can post comments on articles, fostering discussions.
- User Profile: Each user has a personalized profile page that showcases their articles and comments.
- Explore Page: Users can browse and read articles without the need for authentication.
- Admin Panel: The admin panel allows authorized users to manage users, comments, and articles efficiently.




## Installation


1. Clone the repository:

```bash
git clone https://github.com/Nimabht/Onyx-blogging-website
```


2. Install dependencies:

```bash
cd Onyx-blogging-website
npm install
```

3. Setup environment variables in .env file:

```bash
DATABASE_URL=
SESSION_SECRET_KEY=
SERVER_PORT=
ADMIN_USERNAME=
ADMIN_PASSWORD=
```
4. Set up the database:

Ensure MongoDB is installed and running.

5. Start the server:

```bash
npm start
```

## Pages (Client side)

#### Explore page

```http
  GET /explore
```

#### Signup page

```http
  GET /signup
```

#### Login page

```http
  GET /login
```

#### Dashboard page

```http
  GET /dashboard
```

#### My articles page

```http
  GET /my-articles
```

#### Write new article page

```http
  GET /new-story
```

#### Admin panel page

```http
  GET /admin
```

#### Read article page

```http
  GET /article/<:articleId>
```

#### Modify article page

```http
  GET /edit-article/<:articleId>
```

# API Reference

## Authentication

### Signup

```http
  POST /api/auth/signup
```
Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `firstname` | `string` | **Required**. |
| `lastname` | `string` | **Required**. |
| `username` | `string` | **Required**. |
| `gender` | `string` | **limited**. |
| `password` | `string` | **Required**. |
| `repeat_password` | `string` | **Required**. |
| `role` | `string` | **Forbidden**. |


### Login

```http
  POST /api/auth/login
```
Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `username` | `string` | **Required**. |
| `password` | `string` | **Required**. |


### Logout

```http
  GET /api/auth/logout
```

### Reset password

```http
  POST /api/auth/resetpassword/<:userId>
```
Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `currentPassowrrd` | `string` | **Required**. |
| `newPassword` | `string` | **Required**. |

## User

### Get all users

```http
  GET /api/user
```

### Get user by ID

```http
  GET /api/user/<:userId>
```

### Update user

```http
  PUT /api/user/<:userId>
```
Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `firstname` | `string` | **Required**. |
| `lastname` | `string` | **Required**. |
| `username` | `string` | **Required**. |
| `gender` | `string` | **Optional**. |
| `role` | `string` | **limited**. |

### Delete user by ID

```http
  DELETE /api/user/<:userId>
```

## Article

### Get all articles

```http
  GET /api/article
```

### Get articles that owned by user

```http
  GET /api/my-articles
```

### Get article by ID

```http
  GET /api/article/<:articleId>
```

### Create a new article

```http
  POST /api/article
```
Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `title` | `string` | **Required**. |
| `sketch` | `string` | **Optional**. |
| `content` | `string` | **Required**. |

### Update article

```http
  PUT /api/article/<:articleId>
```
Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `firstname` | `string` | **Required**. |
| `lastname` | `string` | **Required**. |
| `username` | `string` | **Required**. |
| `gender` | `string` | **Optional**. |
| `role` | `string` | **limited**. |

### Upload article thumbnail


```http
  PATCH /api/article/update-thumbnail/<:articleId>
```

Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `thumbnail` | `file` | **Required**. |

### Delete article by ID

```http
  DELETE /api/user/<:articleId>
```

## Comment

### Get all comments

```http
  GET /api/comment
```

### Get comments that owned by user

```http
  GET /api/my-comments
```

### Get comment by ID

```http
  GET /api/comment/<:commentId>
```

### Create a new comment

```http
  POST /api/comment
```
Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `content` | `string` | **Required**. |
| `articleId` | `objectId(string)` | **Required**. |

### Update comment

```http
  PUT /api/comment/<:commentId>
```
Request Body:

| Field  | Type     | Description   |
| :--------- | :------- | :------------ |
| `content` | `string` | **Required**. |


### Delete commnet by ID

```http
  DELETE /api/comment/<:commentId>
```
# Stay in touch

- [LinedIn](https://www.linkedin.com/in/nimabeheshtaein/)
- [Email](mailto:nimabeheshtaein99@gmail.com)

# Authors

- [@nimabeheshtaein](https://github.com/Nimabht)
