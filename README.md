Project Documentation

OpenShelf is a file-sharing website designed for students, educators and other people in the acadamia field to share and discuss copyright free resources. It is able to host both pdf documents and mp3 videos, allowing users to download these resources or view them in-browser.

UI Prototype link:
https://www.figma.com/design/r9PrJpdZSoNvuIEjlUbSyT/Team-1-project-pages?node-id=41-54&p=f&t=4YSbYMiOG6IxdymB-0  
Last modified: November 12

Development environment setup:

Before beginning make sure you have installed on your machine:  
- node
- npm
- git

1. First, clone the repository onto your local machine.  
2. Inside the repo's root, install dependencies with the command npm ci.  
3. Further navigate to the packages/express-backend and packages/react-frontend subdirectories, and install their dependencies using npm ci as well.  
4. Create a .env file within ./packages/express-backend, and copy-paste the MongoDB key and SECRET_TOKEN that have been provided to you. If you haven't received these yet, send me (tobohley@gmail.com) an email to get your own copies.  
5. Lastly confirm that ports 5173 and 8000 are free on your system or choose alternative ports that you prefer. One will be used for the frontend and one for the backend.  
 

Continuous integration/cloud location:
https://black-plant-00efa480f.3.azurestaticapps.net

Project Requirements

- Need to be able to sign in.
- Needs to be server/client.
- Need to use databases.

Contributing

-Default ESLint Settings
-Default Prettier-ESLint Settings
-Small update to Prettier Settings for Windows CRLF Compatibility:

{
"endOfLine": "auto"
}

-Recommended to install all 3 VSCode extensions:
https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint
 
-Following AirBNB Javascript style guide at:
https://airbnb.io/javascript/react
