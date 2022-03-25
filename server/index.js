const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const { nanoid } = require('nanoid');
const multer = require('multer');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "music_Streaming_service"
})

var albumArt = "Album Art";
app.use(express.static(albumArt));

app.listen(3001, () => {
    console.log("running on port 3001");
})

app.post("/api/removefromplaylist", (req, res) => {
  const query = "DELETE FROM playlist_songs WHERE playlist_id=(?) AND song_id=(?)";
  db.query(query, [req.body.params.playlistID, req.body.params.songID], (error, results, fields) => {
    if (error)  return console.error(error.message);
    res.send(results);
  })
})

app.post("/api/addtoplaylist", (req, res) => {
  const query = "INSERT INTO playlist_songs VALUES (?, ?)"
    db.query(query, [req.body.params.playlistID, req.body.params.songID], (error, results, fields) => {
      if (error)  return console.error(error.message);
    })
})

app.get("/api/validateuser", (req, res) => {
  const query = "SELECT email FROM users WHERE email=(?) AND password=(?)"
  db.query(query, [req.query.userEmail, req.query.userPassword], (error, results, fields) => {
    if (error)  return console.error(error.message);
    res.send(results);
  })
})

app.get("/api/playlists", (req, res) => {
  const query = "SELECT ID, name FROM playlists WHERE owner = (?)";
  db.query(query, [req.query.owner], (error, results, fields) => {
    if (error)  return console.error(error.message);
    res.send(results);
  })
})

app.post("/api/deleteplaylist", (req, res) => {
  var query = "DELETE FROM playlist_songs WHERE playlist_id=(?)";
  db.query(query, [req.body.params.playlistID] , (error, results, fields) => {
    if (error)  return console.error(error.message);
    query = "DELETE FROM playlists WHERE id=(?)";
    db.query(query, [req.body.params.playlistID], (error, results, fields) => {
      res.send(results);
    })
  })
})

app.post("/api/createplaylist", (req, res) => {
  const query = "INSERT INTO playlists (name, owner) VALUES (?, ?)"
  db.query(query, [req.body.params.playlist, req.body.params.username], (error, results, fields) => {
    if (error)  return console.error(error.message);
    res.send(results);
  })
})

app.get("/api/checkuser", (req, res) => {
  const query = "SELECT email FROM users WHERE email=(?)"
  db.query(query, [req.query.userEmail], (error, results, fields) => {
    if (error)  return console.error(error.message);
    res.send(results);
  })
})

app.get("/api/playlistcontent", (req, res) => {
  var query = "SELECT song_id FROM playlist_songs WHERE playlist_id = (?)";
  var songs = [];
  db.query(query, [req.query.playlistID], (error, results, fields) => {
    if (error)  return console.error(error.message);
    results.forEach(element => {
      songs.push('"' + element.song_id + '"');
    });
    query = "SELECT ID, title, artist, album, uploader, coverpath FROM music_files WHERE ID IN (" + songs + ")";
    db.query(query, [songs], (error, results, fields) => {
      if (error)  return console.error(error.message);
      res.send(results);
    })
  })
})
  
app.post("/api/register", (req, res) => {
  const query = "INSERT INTO users VALUES (?, ?)";
  db.query(query, [req.body.params.userEmail, req.body.params.userPassword], (error, results, fields) => {
    if (error)  return console.error(error.message);
    res.send("Done");
  })
})

app.get("/api/query", (req, res) => {
    const searchTerm = "%" + (req.query.searchTerm) + "%";

    const query = "SELECT ID, title, artist, album, uploader, coverpath FROM music_files WHERE ((title LIKE (?)) OR (artist LIKE (?)) OR (album LIKE (?)) OR (uploader LIKE (?)))"

    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        res.send(results);
    })
})

app.get("/api/song", (req, res) => {
    const query = "SELECT filepath FROM music_files WHERE ID = (?)";
    db.query(query, [req.query.songID], (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        const filePath = results[0].filepath;
        res.setHeader("content-type", "audio/mpeg");
        fs.createReadStream(filePath).pipe(res);
    })
})

app.post("/api/unfavorite", (req, res) => {
  var query = "SELECT ID FROM playlists WHERE name = 'Favorites' AND owner = (?)"
  db.query(query, [req.body.params.user], (error, results, fields) => {
    if(error) return console.error(error.message);
    query = "DELETE FROM playlist_songs WHERE playlist_id = (?) AND song_id = (?)"
    db.query(query, [results[0].ID, req.body.params.songID], (error, results, fields) => {
      if(error) return console.error(error.message);
    })
  })
})

app.post("/api/favorite", (req, res) => {
  var query = "SELECT ID FROM playlists WHERE name = 'Favorites' AND owner = (?)"
  db.query(query, [req.body.params.user], (error, results, fields) => {
    if (error)  return console.error(error.message);
    query = "INSERT INTO playlist_songs VALUES (?, ?)"
    db.query(query, [results[0].ID, req.body.params.songID], (error, results, fields) => {
      if (error)  return console.error(error.message);
    })
  })
})

app.get("/api/checkfavorite", (req, res) => {
  var query = "SELECT ID FROM playlists WHERE name = 'Favorites' AND owner = (?)"
  db.query(query, [req.query.user], (error, results, fields) => {
    if (error)  return console.error(error.message);
    if (results.length === 0) return;
    query = "SELECT * FROM playlist_songs WHERE playlist_id = (?) AND song_id = (?)"
    db.query(query, [results[0].ID, req.query.songID], (error, results, fields) => {
      if (error)  return console.error(error.message);
      res.send(!(results[0] === undefined));
    })
  })
})

app.get("/api/metadata", (req, res) => {
    const query = "SELECT title, artist FROM music_files WHERE ID = (?)";
    db.query(query, [req.query.songID], (error, results, fields) => {
        if (error)  return console.error(error.message);
        res.send(results);
    })
})

app.get("/api/albumart", (req, res) => {
    const query = "SELECT coverpath FROM music_files WHERE ID = (?)";
    db.query(query, [req.query.songID], (error, results, fields) => {
        if (error)  return  console.error(error.message);
        res.send(results)
    })
})

app.get("/api/artists", (req, res) => {
  const query = "SELECT artist, coverpath FROM music_files WHERE coverpath != '' GROUP BY artist";
  db.query(query, (error, results, fields) => {
    if (error)  return console.error(error.message);
    res.send(results);
  })
})

var fileName = "";

function generateFileName() {
  var newName = nanoid();
  while (fs.existsSync('./Music Files/' + newName + '.mp3') || fs.existsSync('./MusicFiles/' + newName + '.flac'))  newName = nanoid();
  fileName = newName;
}