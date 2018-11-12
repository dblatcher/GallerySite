# GallerySite
This is a customisable template for a website that displaying galleries of images. The aim is to provide a robust basic site that will be easy to set up and can be maintained and updated without development skills. 
It is written in NodeJS using the [Express](https://expressjs.com/) framework. 
## Current Features
 - New images and galleries can be added to the app without editing any code. A route to a gallery page is created for each subfolder in the 'Galleries' folder on the server.
 - Properties (description, background colors etc) for each gallery page can be set by JSON files placed in the subfolder for each gallery.
 - Gallery view pages have responsive design and swipe controls.
 - General site pages (eg 'about', 'contact etc') easy to add by editing pages list at top level.
 - customisable footers and headers (with dynamic nav bar derived from pages list) for consistent page design across site.
 - user authentication: can log in with username and password to access 'admin' pages or other non-public areas of the site.
 - site level and page level CSS (easy to make it all prettier) 
## Planned features 
 - Admin Page with content management front-end for editing galleries (in progress).
 - news / articles features
