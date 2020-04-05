# Goal

- Build a web app from start to finish using the tech and approaches learned to date
- Turn requirements into a working product
- Practice architecting an app in terms of UI/UX, Routes/API and Database
- Manage a multi-developer project with git
- Simulate the working world where you do not always get to completely cherry pick your team, stack or product features
- Practice demoing an app to help prepare for the final project and employer interviews

## Stack Requirements

Your projects must use:

- ES6 for server-side (NodeJS) code
- NodeJS
- Express
  - RESTful routes
- One or more CSS or UI "framework"s:
  - jQuery
  - A CSS preprocessor such as SASS, ~~Stylus, or PostCSS for styling -- or CSS Custom properties and no CSS preprocessor~~
- PostgreSQL and pg (with promises) for DBMS
- git for version control

## Optional Requirements

- SPA (Single-Page Application) Behaviour
- Hosting, such as heroku, netlify, github pages, AWS, or Azure

## Option 7: Resource Wall

Pinterest for learners.

Allow learners to save learning resources like tutorials, blogs and videos in a central place that is publicly available to any user.

## Requirements:

- users should be able to save an external URL along with a title and description
- users should be able to search for already-saved resources created by any user
- users should be able to categorize any resource under a topic
- users should be able to comment on any resource
- users should be able to rate any resource
- users should be able to like any resource
- users should be able to view all their own and all liked resources on one page ("My resources")
- users should be able to register, log in, log out and update their profile

# Design

## User stories

As a user I want to [be able to] ...

## ERD

- users
  - username
  - password
  - name
  - email
  - phone
  - etc..

- categories
  - name

- resources
  - user_id
  - category
  - title
  - description
  - content (json: url, image, etc)

- likes
  - user_id
  - resource_id
  - emoji_id

- ratings
  - user_id
  - resource_id
  - rating

- comments
  - user_id
  - resource_id
  - body

![ERD](docs/resource-wall-erd.png "ERD")

## Wireframe

![Wireframe](docs/wireframe.png "Wireframe")
