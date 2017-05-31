# WhatSound PlayList MicroService
Endpoint to get a JSON object from CLoudantDB as response
#REST API to insert voted track:
```
    POST https://whatsound-playlist.mybluemix.net/whatsound/api/v1/playlist/insert
    Request Body: 
    {
    "track":{
        "track_name": "Shape of You",
        "voter": {
            "name": "Edison",
            "photo": "url"
        },
        "uri": "spotify:track:123"
        }
    }
```
# Response for 
Success: 
```
 {
   "message": "Vote computed correctly",
   "status": true
 }
```
Failure for double votes: 
```
{
  "message": "Forbidden, already voted.",
  "status": false
}
```
# REST API to get ranking:
```
    POST https://whatsound-playlist.mybluemix.net/whatsound/api/v1/playlist/insert
    Request Body: 
    {
    "track":{
        "track_name": "Shape of You",
        "voter": {
            "name": "Edison",
            "photo": "url"
        },
        "uri": "spotify:track:123"
        }
    }
```
# Response for 
Success: 
```
    GET https://whatsound-playlist.mybluemix.net/whatsound/api/v1/playlist/ranking
  {
   "ranking": [
     {
       "track_name": "Shape of You",
       "votes": 2,
       "voters": [
         {
           "name": "Rabah",
           "photo": "url"
         },
         {
           "name": "Edison",
           "photo": "url"
         }
       ],
       "uri": "spotify:track:123"
     }
   ],
   "status": true
 }
```
Failure: 
```
 {
   "message": "Could not handle the request",
   "status": false
 }
```
# WhatSound SetList Microsservice
Endpoint to get a JSON object from CLoudantDB as response
#REST API to insert vote:
```
    POST https://whatsound-playlist.mybluemix.net/whatsound/api/v1/setlist/vote
    Request Body:
    {
        "voter":{
            "name": "Rabah",
            "photo": "url"
        },
        "track_id": 1
    }
```
# Response for
Success:
```
 {
   "message": "Vote computed correctly",
   "status": true
 }
```
Failure for double votes:
```
{
  "message": "Forbidden, already voted.",
  "status": false
}
```
# REST API to get setist:
```
    GET https://whatsound-playlist.mybluemix.net/whatsound/api/v1/setlist
```
# Response for
Success:
```
    GET https://whatsound-playlist.mybluemix.net/whatsound/api/v1/playlist/ranking
    {
      "setlist": [
        {
          "track_name": "Don't You(Forget About Me)",
          "votes": 0,
          "voters": [],
          "id": 1,
          "uri": "spotify:track:0A4PZuepTcIQVvA5m7R0M1"
        }
        .
        .
        .
```
Failure:
```
 {
   "message": "Could not handle the request",
   "status": false
 }
```