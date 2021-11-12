# EUVI server

# AUTH :

  * Access token => 
    - Route: GET /api
    - Response: { message: '' }

  * Sign up => 
    - Route: POST /api/login

  * Login => 
    - Route: POST /api/signup

  * Login / Sign up response: 
    - header: "x-access-token", access_token, 
      body: { 
        message: '',
        userId: '',
        username: '',
        name: '',
        avatar: ''
      }

  * Logout => #TODO;
  * Delete account => #TODO


# TODO: (controllers)
 - post
 - get all comments 
 - add comment
 - add comment and refresh
 - like comment
 - notifications
 - get all recommendations (from single recommendation - all users that recommended)
 - see all recommendations

# TODO: (socket.io)
 - send notification on like
 - send notification on follow
 - send notification on comment
 - send notification on recommendation

# TODO (PUSHER)
