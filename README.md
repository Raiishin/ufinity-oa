# ufinity-oa
A simple backend service that allows teachers to perform administrative tasks for their students

# Prerequisite software/tools
- Docker
- nodejs (npm)

# Starting the service
1. Create a .env file, referencing .env.example
2. Start up the docker containers
   - mysql database
   - phpmyadmin
3. Install the required packages by running the command ```npm install```
4. Setup the database ```npm run database:start```
5. Start up the backend app by running the command ```npm run start```
6. You can start making queries to the backend!

# Sample Queries and Responses
## POST /api/register

``` 
Body: {
    "teacher": "teacherken@gmail.com",
    "students": [
        "studentjon7@gmail.com"
    ]
}

Response: "Success"
```

## POST /api/suspend

``` 
Body: {
 "student" : "studentjon7@gmail.com"
}

Response: "Student studentjon7@gmail.com has been successfully suspended."
```

## GET /api/commonstudents

``` 
Query Params: {
 "teacher" : "teacherken@gmail.com"
}

Response: {
    "students": [
        "studenthon@gmail.com",
        "studentjon1@gmail.com",
        "studentjon2@gmail.com",
        "studentjon3@gmail.com",
        "studentjon4@gmail.com",
        "studentjon5@gmail.com",
        "studentjon6@gmail.com",
        "studentjon7@gmail.com",
        "studentjon@gmail.com"
    ]
}
```

## POST /api/retrievefornotifications

``` 
Body: {
    "teacher": "teacherken@gmail.com",
    "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com @studentmiche1@gmail.com"
}

Response: {
    "recipients": [
        "studentagnes@gmail.com",
        "studentmiche@gmail.com",
        "studentmiche1@gmail.com",
        "studentjon@gmail.com",
        "studenthon@gmail.com",
        "studentjon1@gmail.com",
        "studentjon2@gmail.com",
        "studentjon3@gmail.com",
        "studentjon4@gmail.com",
        "studentjon5@gmail.com",
        "studentjon6@gmail.com",
        "studentjon7@gmail.com"
    ]
}
```
