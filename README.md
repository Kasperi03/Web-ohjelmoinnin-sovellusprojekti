# Web-ohjelmoinnin-sovellusprojekti
[UI documentation](https://www.figma.com/proto/ycfovC17k9AZn9hIzs0itX/Web?node-id=3-3&t=CDUMuOHy9a09LJq0-1)

[REST API docs](https://documenter.getpostman.com/view/42564827/2sB3dQvpgC)


Movie database web application inspired by TMDB, built with React and JavaScript, and fully containerized using Docker.

Features:
- Registration, login / logout and deleting account
- Browse movies via carousel. Movies are in two categories which are "now in theaters" and "trending".
- Search functionality with 3 categories: Movie title, actor and genre.
- Movie Details page after clicking movie card. Shows the movie title, trailer, rating,reviews, description of the movie and logged in users can leave reviews.
- Add movie to favorites list and deletion of the movie from the list.
- Share your own favorite list and view others via link.
- Make a group where other users can request to join and the group owner (the user who made the group) can accept the new users.
- Users can add movie to group's movie list and the group owner can delete them.
- If the group owner deletes his account, the group ownership goes to the next person who joined the group after the owner.
- Responsive UI



Frontend: React, JavaScript, css.
Backend: JavaScript, PostgreSQL, Express.js
API: TMDB API.






**Frontend:** React, JavaScript, css.

**Backend:** JavaScript, PostgreSQL.

**API:** TMDB API.






**Requirements**


-Docker





**Installation:**


**Clone the repository.**

git clone https://github.com/Kasperi03/Web-ohjelmoinnin-sovellusprojekti

cd docker_fullstack



**Run with docker:**

docker-compose up --build



**Open with:**

http://localhost:3000
