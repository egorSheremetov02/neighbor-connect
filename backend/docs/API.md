# NeighborConnect API documentation

## General info

### Tokens

All authentication is done via [JWT tokens](https://jwt.io/). **Every single** request (except authentication endpoints) should **always** use the Authorization HTTP header with Bearer schema to supply the requester's token. **Every single** endpoint should **always** check the supplied token for validity and return 403 in case the token does not pass the checks.

All tokens used by this system should have the same structure:

```json
{ 
  "sub": string, // subject: user id
  "exp": timestamp, // expiry date
}
```

All tokens are signed by the authentication service. Its public key is privately stored in all other services, so that any service can verify the token on its own. These keys should periodically be manually updated for security.

## Authentication endpoints

### Register

Create a new account in the system.

* Endpoint: `POST /register`
* Request body:

```json
{
    "fullName": string,
    "login": string,
    "email": string,
    "password": string,
    "address": string,
    "birthday": timestamp (optional),
    "additionalInfo": string (optional)
}
```

* Response: empty (only status code)

* Notes:
  * take the necessary security precautions when storing the password (hashing, salting, etc.)
  * return 400 if:
    * `fullName` is longer than 255 symbols
    * `password` is shorter than 8 symbols
  * return 409 if user with same `email` or `login` already exists
  * in case there is an error, make sure to add a meaningful plaintext error description in response body
  * return 200 if and only if you have successfully created a new user entry in the database
  * the client is supposed to proceed to `/login` after creating the account

### Log in

Log into an account in the system. A successful login returns a JWT token.

* Endpoint: `POST /login`
* Request body:

```json
{
    "login": string,
    "password": string,
}
```

* Response body:

```json
{
    "token": string,
}
```

* Notes:
  * return 404 if `login` does not belong to a registered user
  * return 403 if `password` does not match
  * the token validity is TBD, let it be ~1 week

### Get user data

This endpoint is for internal use between services, for example, for getting a user's email or name.

In order to not disclose user data publicly, this endpoint should only allow requests from whitelisted IP addresses of other app services.

* Endpoint: `GET /users/{user_id}`
* Request params: empty
* Response body:

```json
{
  "user_id": string,
  "fullName": string,
  "email": string,
  "address": string
}
```

* Notes:
  * return 404 if no user with `user_id` exists
  * return 403 if requester's IP is not whitelisted

## Chat endpoints

### Important notes

You can find more details about checking preconditions of all the API requests **in the sequence diagram** (*TODO: link or reference*). All in all, the API description below assumes that both the user's token and the correctness of the request's query **has been already checked beforehand**.

Our "chats" are somewhere in the middle between real-time chats and asynchronous forums. Building our own version of a complete messenger app is not the main priority. As such, communication from server to client is not thoroughly thought through. To notify a user about, for example, a new message, use long-polling from client as the easiest way.

### Definitions

* A `Message` represents a single chat message. Its structure is as follows:

```json
{
    "content": string,
    "image_id": int (optional), 
    "author_id": int,
    "author_name": string,
    "created_at": timestamp
}
```

* A `Tag` is a `string` that satisfies all of the following conditions:
  * not longer than 64 symbols
  * only contains characters `a-z`, `A-Z`, `0-9`, or hyphen `-`

### Create chat

Creates a new chat in the database and notifies the participants of the chat.

* Endpoint: `POST /chats`
* Request body:

```json
{ 
  "name": string,
  "description": string,
  "tags": [string],
  "image_id": int (optional),
  "users": [int] // list of the id-s of the users to initially add to the chat
}
```

* Response body (on success):

```json
{
  "chat_id": int
}
```

* Specification notes:
  * the admin of the chat is the user created the chat
  * `users` should include the sender (the admin user)
  * return 403 if the sender does not have rights to create a chat (maybe they are banned or smth)
  * return 400 if at least one of the following is true:
    * `name` is longer than 128 symbols
    * `description` is longer than 255 symbols
    * `tags` has more than ~25 elements
    * one of the `tags` is not a valid `Tag`:
    * `image_id` is specified, but no such image exists at the images storage
    * `users` does not include the sender (the admin user)
    * `users` has more than 1000 elements

* *Implementation notes:*
  * use the user token to get the sender's data
  * the intial participants of the chat should be notified about the chat has been created
  * if the creator wants to set an image of the chat...
    * the image should be first uploaded to the images storage via `POST /images` API once the user selected it
    * and then its id should be sent in the chat-creation request as `image_id`

### Edit chat data

Edits the chat's info / its participants list in the database and possibly notifies the participants of the chat.

* Endpoint: `PUT /chats`
* Request body:

```json
{ 
  "chat_id": int,
  "name": string,
  "description": string,
  "tags": [string],
  "image_id": int (optional),
  "users": [int],
  "admin_users": [int]
}
```

* Response body: empty (only status code)

* Specification notes:
  * `users` field should include the sender
  * return 403 if the sender does not have rights to edit the chat's info (for example, the sender is not a chat's participant or is not an admin user)
  * return 400 if at least one of the following is true:
    * `name` is longer than 128 symbols
    * `description` is longer than 255 symbols
    * `tags` has more than ~25 elements
    * one of the `tags` is not a valid `Tag`
    * `image_id` is specified, but no such image exists at the images storage
    * `users` field does not include the sender
    * `users` has more than 1000 elements
    * `admin_users` is not a subset of `users`

* *Implementation notes:*
  * use the user token to get the sender's data
  * the notifications should be sent:
    * for the new participants of the chat
    * for all the participants if the name or the image of the chat have been modified
  * if the sender wants to set a new image of the chat...
    * the image should be first uploaded to the images storage via `POST /images` API once the user selected it
    * and then its id should be sent in the edit-chat request as `image_id`

### Delete chat

Deletes both the chat from the database and notifies the participants of the chat.

* Endpoint: `DELETE /chats`

* Request body:

```json
{ 
  "chat_id": int
}
```

* Response body: empty (only status code)

* Specification notes:
  * return 403 if sender does not have rights to delete the chat (i.e. is not that chat's admin)
  * return 404 if `chat_id` does not exist

* *Implementation notes:*
  * use the user token to get the creator's data
  * the participants of the chat should be notified about the chat has been deleted
  * delete all the info of the chat from the database
    * delete the image of the chat from the storage via `DELETE /images`

### Send message

Stores a new message in the chat's database and notifies the participants of the chat.

* Endpoint: `POST /chats/{chat_id}`

* Request body:

```json
{ 
  "content": string,
  "image_id": int (optional)
}
```

* Response body: empty (only status code)

* Notes:
  * return 404 if `{chat_id}` does not exist
  * return 403 if the sender does not have access to this chat
  * return 400
    * if the message content is longer than ~5000 symbols
    * or `image_id` is specified, but no such image exists at the images storage

* *Implementation notes:*
  * use the user token to get the sender's data
  * the participants of the chat should be notified about the message has been sent
  * if the user wants to attach an image to the message...
    * the image should be first uploaded to the images storage via `POST /images` API once the user selected it
    * and then its id should be sent in the send-message request as `image_id`

### List messages

List previous messages from a chat. Use pagination with ~100 messages per page.

* Endpoint: `GET /chats/{chat_id}`

* Request body:

```json
{
  "page_id": int (optional)
}
```

* Response body:

```json
{
  "messages": [ Message ],
  "next_page_id": int (optional)
}
```

* Notes:
  * if `page_id` is not provided, the latest page should be used
  * return 400 if `{page_id}` is not valid (there exists no page with such id)
  * return 404 if `{chat_id}` does not exist
  * return 403 if the sender does not have access to this chat

* *Implementation notes:*
  * use the user token to get the sender's data

## Incident Endpoints

### List all Incident Posts

Retrieve a list of all incidents in the system.

- Endpoint: `GET /incidents`
- Request body: empty
- Response body:

```json
{
  "incidents": [
    {
      "id": int,
      "title": string,
      "description": string,
      "author_id": int,
      "status": string,
      "created_at": timestamp,
      "updated_at": timestamp
    }
    // Other incidents...
  ]
}
```

- Notes:
  - Possible values for `status`: "pending", "verified", "rejected".
  - Return 200 with an empty array if there are no incidents.

### Create an Incident

Create a new incident in the system.

- Endpoint: `POST /incidents`
- Request body:

```json
{
  "title": string,
  "description": string,
  "author_id": int
}
```

- Response body (upon successful creation):

```json
{
  "id": int
}
```

- Notes:
  - `author_id` - the identifier of the incident's author.
  - Return 400 if any of the mandatory fields are missing.
  - Return 500 in case of an internal server error.

### Edit an Incident

Edit an existing incident.

- Endpoint: `PUT /incidents/{incident_id}`
- Request body:

```json
{
  "title": string,
  "description": string,
  "author_id": int
}
```

- Response body: empty (only status code)

- Notes:
  - Return 404 if the incident with the given `incident_id` does not exist.
  - Return 403 if the user does not have permissions to edit the incident.
  - Return 400 if any of the mandatory fields are missing.
  - Return 500 in case of an internal server error.

### Delete an Incident

Delete an incident from the system.

- Endpoint: `DELETE /incidents/{incident_id}`
- Request body: empty
- Response body: empty (only status code)

- Notes:
  - Return 404 if the incident with the given `incident_id` does not exist.
  - Return 403 if the user does not have permissions to delete the incident.
  - Return 500 in case of an internal server error.

### Authorize Incidents

Authorize the validity of an incident on behalf of an admin.

- Endpoint: `PUT /incidents/{incident_id}/authorize`
- Request body:

```json
{
  "status": "verified" // or "rejected"
}
```

- Response body: empty (only status code)

- Notes:
  - Return 404 if the incident with the given `incident_id` does not exist.
  - Return 403 if the user does not have permissions to authorize the incident.
  - Return 400 if the status is not "verified" or "rejected".
  - Return 500 in case of an internal server error.

## Offer Endpoints

### Create an Offer

Create a new offer.

- Endpoint: `POST /offers`
- Request body:

```json
{
  "title": string,
  "description": string,
  "author_id": int,
  "price": float,
  "tags": [string],
  "date": timestamp,
  "image_id": int
}
```

## Image Storage endpoints

All this edpoints require auth token (don't forget add it to header)

### Store an image

The image can be stored by submitting this form to `image_storage/`

```html
<form id="uploadForm" enctype="multipart/form-data" method="post">
  <label for="file">Choose an image:</label>
  <input type="file" id="file" name="file" accept="image/*" required>
  <input type="hidden" name="image_type" value="avatar">
  <button type="submit">Upload Image</button>
</form>
```

You can choose between `avatar` and `image` image types. This parameter is responsible for compression.
Avatars will be compressed and cropped further to reduce storage cost.

This request will return an id of the stored picture. 
The example page that can send such request can be found in `docs/image_storage_test.html` 
(the test html doesn't handle authentication, so it needs to be disabled).

### Retrieving an image

The image can be retrieved by sending a get request:

```
/image_storage?image_id=...
```

`image_id` is the id returned in the previous step.
