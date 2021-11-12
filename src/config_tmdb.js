
const tmdb = {
  site_url: 'https://www.themoviedb.org',
  base_url: 'https://api.themoviedb.org/3',
  images: {
    base_url:"http://image.tmdb.org/t/p/",
    secure_base_url:"https://image.tmdb.org/t/p/",
    backdrop_sizes:["w300","w780","w1280","original"],
    logo_sizes:["w45","w92","w154","w185","w300","w500","original"],
    poster_sizes:["w92","w154","w185","w342","w500","w780","original"],
    profile_sizes:["w45","w185","h632","original"],
    still_sizes:["w92","w185","w300","original"]
  },
  genres:[
    { id:28, name:"Action", name_pt:"Ação" },
    { id:12, name:"Adventure", name_pt:"Aventura"},
    { id:16, name:"Animation", name_pt:"Animação"},
    { id:35, name:"Comedy", name_pt:"Comédia" },
    { id:80, name:"Crime", name_pt:"Crime" },
    { id:99, name:"Documentary", name_pt:"Documentário" },
    { id:18, name:"Drama", name_pt:"Drama" },
    { id:10751, name:"Family", name_pt:"Família" },
    { id:14, name:"Fantasy", name_pt:"Fantasia" },
    { id:36, name:"History", name_pt:"História" },
    { id:27, name:"Horror", name_pt:"Terror" },
    { id:10402, name:"Music", name_pt:"Música" },
    { id:9648, name:"Mystery", name_pt:"Mistério" },
    { id:10749, name:"Romance", name_pt:"Romance" },
    { id:878, name:"Science Fiction", name_pt:"Ficção científica" },
    { id:10770, name:"TV Movie", name_pt:"Cinema TV" },
    { id:53, name:"Thriller", name_pt:"Thriller" },
    { id:10752, name:"War", name_pt:"Guerra" },
    { id:37, name:"Western", name_pt:"Faroeste" }
  ],
  statuses: ['Returning Series', 'Planned', 'In Production', 'Ended', 'Canceled', 'Pilot'],
  blocked: [ 603875 ]
};

export default tmdb;
