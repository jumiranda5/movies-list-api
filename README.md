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

  * Logout => 
    - Route: POST /api/logout
    - Response: { message: '' }

  * Delete account => #TODO

# USER:

  * Search user =>
    - Route: GET /api/user/search/:page/:search
    - Response: {
        message: `Found users.`,
        result: [
          {
            userId: '',
            username: '',
            name: '',
            avatar: '',
            isFollowing: boolean
          }
        ]
      }
    
# FOLLOW:

  * Follow =>
    - Route: POST /api/follow/:to
    - Response: { message: '' }

  * Unfollow =>
    - Route: POST /api/follow/:to
    - Response: { message: '' }

# TMDB:

  * Search multi =>
    - Route: GET /api/tmdb/search/multi/:query/:page/:lang
    - Response: {
        message: '',
        isLastPage: boolean,
        result: {
          title: '',
          tmdb_id: '',
          type: '',
          overview: '',
          release_year: '',
          poster: '',
          popularity: '',
          adult: boolean,
          genre: [],
          isBookmarked: boolean
        }
      }

# WATCHLIST

  * Add title =>
    - Route: POST /api/watchlist/add
    - Response: { message: '' }

  * Delete title => 
    - Route: POST /api/watchlist/delete/:type/:id
    - Response: { message: '' }

#

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
