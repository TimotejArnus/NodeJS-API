# NodeJS-API

API is composed of 2 servers one for Auth (authServer.js) and contacts (server.js)
With AuthServer you can register and Login, when you login successfully the api will send acces token (JWT) to client
Server.js will use JWT to auth the user so it can add contact to it's list (name,email,phone) using MongoDB , it can also delete contacts and edit them
