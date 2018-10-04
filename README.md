# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

### Specification

+All content is responsive.
+Accessibility features done.
+Service Workers is implemented.
+Caching is implemented when the network is gone.


### Steps to run program

1. When I download code again,I realized that there is an issue at server api.
2. Before that I couldn't add a review to page same as you. So I realized that you should set defaultLimit ="60" on server.
Because When I add a review to db , I use this endpoint  "http://localhost:1337/reviews/?restaurant_id='+rest_id" . So When you add a review, you would check this endpoint and you will see there is a new comment inside. But the problem is that I fetch review data this endpoint = "localhost:1337/reviews" .
When you go to this endpoint, you will see there is just 30 comments. I realized that you should set defaultLimit to mws-restaurant-stage-3.

Steps;

mws-restaurant-stage-3 => config => blueprints.js => change //defaultLimit=30 to defaultLimit=60 (at the bottom of the page.) .  After that you will see everything it works.

### What do I do from here?

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. 

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.
3. Explore the provided code, and make start making a plan to implement the required features in three areas: responsive design, accessibility and offline use.
4. Write code to implement the updates to get this site on its way to being a mobile-ready website.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 



