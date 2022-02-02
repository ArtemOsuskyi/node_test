# TEST NodeJS task
REST API server with Bearer token authentication written on TypeScript

<b>Prerequisites:<b> <br>

    TypeScript
    Express + @types/express
    TypeORM + reflect-metadata
    PostgreSQL
    jsonwebtoken + @types/jsonwebtoken
    cors + @types/cors
    ping + @types/ping
    dotenv


#API Routes:

HEADERS:

    • Access-Control-Allow-Origin: * 
    • Content-Type: application/json 

ROUTES:

• /signin [POST] - request for bearer token by ID and password
-
    Input data:
    {
        "username": "your_username"
        "password": "your_password"
    }
    
    Output data:
        • Success:
        {
            "message": "Login successful"
        }
            + access token in Token header
        
        • Failure:
        {
            "error": "LoginPasswordInvalidationError",
            "message": "Username or password are invalid"
        }

• /signup [POST] - creation of new user
-
    Input data:
    {
        "username": "your_username" (email/phone number)
        "password": "your_password"
    }
    
    Output data:
     • Success:
        {
            "message": "Signup successful"
        }
         + access token in Token header
         After registration, field "idType" is set for either email or phone number
    
        • Failure:
        {
            "error": "IdTakenError",
            "message": "This ID is already taken"
        }
        ---------
        {
            "error": "InvalidIdFormatError",
            "message": "Incorrect ID format"
        }
        ---------

• /info [GET] - returns user id and id type
-
    Input data:
     • Header 'Authorization': Bearer *TOKEN*

    Output data:
     • Success:
        {
            "id": "bearer_token_id",
            "idType": "bearer_token_id_type"
        }

    • Failure:
       Status 403 Forbidden

• /latency [GET] - returns service server latency for google.com
-

    Output data:
    {
        "result": "time_in_ms"
    }

• /logout?all [GET] - removes bearer token 
- 
    true - removes ALL bearer tokens
    false - remove only current token
   
```
Input data:
    • Header 'Authorization': Bearer *TOKEN*
    
Output data:
    • Success:
        - with ?all=false
        {
            "message": "Logout successful"
        }
        - with ?all=true
        {
            "message": "Logout succesful, all tokens were removed"
        } 
    • Failure:
       {
            "error": "InvalidTokenError",
            "message": "Token doesn't exist"
       }
       -----------
       {
            "message": "Token is already expired"
       }
       -----------
       {
            "message": "Param 'all' must be specified
       }
```

    
