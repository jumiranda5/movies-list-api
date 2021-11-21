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

  * Profile =>
    - Route: GET /api/user/profile/:userId
    - Response: {
        message: 'Success',
        user: user,
        followersCount: int,
        followingCount: int,
        postsCount: int,
        isOwnProfile: boolean,
        isFollowing: boolean,
        posts: []
      }

  * Edit Profile =>
    - Route: GET /api/user/edit-user
    - Response: { user }
    
# FOLLOW:

  * Follow =>
    - Route: POST /api/follow/:to
    - Response: { message: '' }

  * Unfollow =>
    - Route: POST /api/follow/:to
    - Response: { message: '' }

  * Followers =>
    - Route: GET /api/followers/:userId/:page
    - Response: {
        message: '',
        result: {
          userId: '',
          username: '',
          name: '',
          avatar: '',
          isFollowing: boolean
        }
      }

  * Following =>
    - Route: GET /api/following/:userId/:page
    - Response: {
        message: '',
        result: {
          userId: '',
          username: '',
          name: '',
          avatar: '',
          isFollowing: boolean
        }
      }

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

  * Watchlist =>
    - Route: GET /api/watchlist
    - Response: {
        message: '',
        series: [],
        movies: []
      }

# POST:
  
  * Add post =>
    - Route: POST /api/post/add/:type
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
