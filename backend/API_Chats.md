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
