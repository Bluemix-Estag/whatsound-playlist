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


#REST API to get ranking:
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


