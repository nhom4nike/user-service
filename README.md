# user-service

# Các route trừ /register, /login, /refresh đều phải add accessToken vào header

# POST /register

# POST /login

body: {
email: 'email',
password: 'password'
}

return {
accessToken: 'accessToken',
refreshToken: 'refreshToken',
data: {
userInfo
}
}

accessToken: chứa userId, hết hạn trong 5p,
refreshToken: chứa userId,không có thời gian hết hạn, được lưu vào trong userModel. Khi thông tin user thay đổi hoặc user thoát ra khỏi hệ thống thì sẽ tiến hành xóa refreshToken

# POST /refresh

body {
refreshToken: 'refreshToken',
}

return {
accessToken: 'newAccessToken',
refreshToken: 'newRefreshToken',
}

lấy userId trong refreshToken,
newAccessToken: tuơng tự lúc login,
newRefreshToken: tuơng tự lúc login,

# DELETE /logout

Đã có accessToken trong header
Tiến hành lấy userId trong accessToken và xóa refreshToken trong userModel,
