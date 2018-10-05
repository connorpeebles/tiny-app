# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

#### Screenshot of a user's short URL collection:
!["Screenshot of a user's short URL collection"](https://github.com/connorpeebles/tiny-app/blob/master/docs/tinyapp_urls.png?raw=true)

#### Screenshot of the edit & analytics page:
!["Screenshot of the edit & analytics page"](https://github.com/connorpeebles/tiny-app/blob/feature/analytics/docs/tinyapp_edit.png?raw=true)

#### Screenshot of the login page:
!["Screenshot of the login page"](https://github.com/connorpeebles/tiny-app/blob/master/docs/tinyapp_login.png?raw=true)

## Features

- Create a shortened URL for a specified website.
- View your personal collection of shortened URLs.
- Edit the website for a specific shortened URL.
- Delete shortened URLs from your personal collection.
- Track short URL analytics, including number of total visits, number of unique visitors, and visitor ID, date, and time for each unique visit.
- Register and login with email and password for access.

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override

## Getting Started

- Install all dependencies (using the 'npm install' command).
- Run the development web server using the 'node express_server.js'