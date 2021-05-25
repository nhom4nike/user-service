# user-service

> **API BaseURL:** `https://api.04-nike.tk/user`

- Testing URL: `http://04-nike.tk:4001`

Các route trừ /register, /login đều phải add accessToken vào header

# Response code

- `200`: OK
- `400`: Bad Request, Xem chi tiết lỗi trong message trả về
- `401`: Unauthorized, Thiếu headerToken, thêm Token: Authorization: Bearer 'accessToken'
- `500`: Internal Server Error

<!-- ## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key | -->

# POST /register

```js
    body: {
        username: 'username',
        email: 'email',
        password: 'password', // hash
        firstName: 'firstName',
        lastName: 'lastName',
        telephone: 'telephone',
        position: 'position',
        publicKey: 'publicKey',
        crypt: 'crypt',
    }
```

```js
return {
  id: 'userId'
}
```

# POST /login

```js
    body: {
        email: 'email',
        password: 'password'
    }
```

```js
return {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: {
    _id: '_id',
    firstName: 'firstName',
    lastName: 'lastName',
    telephone: 'telephone',
    position: 'position',
    status: 'status',
    username: 'username',
    email: 'email',
    password: 'password',
    publicKey: 'publicKey',
    crypt: 'crypt'
  }
}
```

- accessToken: chứa userId, hết hạn trong 5p,
- refreshToken: chứa userId,không có thời gian hết hạn, được lưu vào trong userModel. Khi thông tin user thay đổi hoặc user thoát ra khỏi hệ thống thì sẽ tiến hành xóa refreshToken

# POST /refresh

```js
    body {
        refreshToken: 'refreshToken',
    }
```

```js
return {
  accessToken: 'newAccessToken',
  refreshToken: 'newRefreshToken'
}
```

- lấy userId trong refreshToken,
- newAccessToken: tuơng tự lúc login,
- newRefreshToken: tuơng tự lúc login,
- update refreshToken cho user là newRefreshToken

# DELETE /logout

- Đã có accessToken trong header
- Tiến hành lấy userId trong accessToken và xóa refreshToken trong userModel,

# GET /info

```js
return {
  _id: '_id',
  firstName: 'firstName',
  lastName: 'lastName',
  telephone: 'telephone',
  position: 'position',
  status: 'status',
  username: 'username',
  email: 'email',
  password: 'password',
  publicKey: 'publicKey',
  crypt: 'crypt'
}
```

# PUT /update
