## GSDLabs Authentication Challenge

### How to run locally
  1) Clone the repo
  2) `npm install`
  3) Start a local mongodb instance. You can run it in a docker container or just download mongodb from their website.
  4) `npm start`

Mongodb in docker:
```
docker pull mongo
docker run --name some-mongo -p 27017:27017 -d mongo
```

### Authentication
A request will be authenticated if it contains an `x-access-token` header with a valid jwt access token issued by the login or signup endpoints. Access tokens are valid for 10 minutes (feel free to change this during development).

### Errors
All errors returned in the responses are generated via [Boom](https://github.com/hapijs/boom). If a request payload is missing a required key, the error will be a 400 with the message *Invalid request payload input*.

### Password schema
Minimum 8 characters, contains a lowercase and an uppercase letter and a number.

### API
#### POST /users
Creates a User.

**Authenticated**: false  
**Request format**: application/x-www-form-urlencoded  
**Request payload**:  
  email: string, required  
  name: string, required,  
  password: passwordSchema, required  

**Response format**: application/json  
**Response payload**:  
  jwt: string (short term access token)  
  refresh_token: string (refresh token)  


#### POST /access-tokens
Logs in a user.

**Authenticated**: false  
**Request format**: application/x-www-form-urlencoded  
**Request payload**:  
  email: string, required  
  password: passwordSchema, required  

**Response format**: application/json  
**Response payload**:  
  jwt: string (short term access token)  
  refresh_token: string (refresh token)  

#### POST /access-tokens/refresh
Refreshes an expired access token.
 
**Authenticated**: Yes (expired tokens are accepted)  
**Request format**: application/x-www-form-urlencoded   
**Request payload**:  
  refresh_token: string, required  

**Response format**: application/json  
**Response payload**:  
  jwt: string (short term access token)  

#### DELETE /access-tokens
Logs out a user.

**Authenticated**: Yes  
**Request format**: application/x-www-form-urlencoded  
**Request payload**:  
  refresh_token: string, required  

**Response format**: 204 No Content

#### GET /me
Returns current user information.

**Authenticated**: Yes  
**Response format**: application/json  
**Response payload**:  
  name: string  
  email: string  
  avatar_url: string  
