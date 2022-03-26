import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import {retrieveArtists, getAlbumArt, getMetadata, streamSong, query} from './general.js';
import {removeFromPlaylist, addToPlaylist, getPlaylists, deletePlaylist, createPlaylist, retrievePlaylistContent, checkFavorite} from './playlists.js';
import {initDB} from "./database.js";
import {getMusic} from "./local.js";

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

var albumArt = "./Album Art";
app.use(express.static(albumArt));
const MUSICDIR = "E:\\Music";

app.listen(3001, () => {
    console.log("running on port 3001");
    //initDB();
    //getMusic(MUSICDIR, true);
})

// playlists
app.post("/api/removefromplaylist",
    (req, res) => { removeFromPlaylist(db, res, req.body.params.playlistID, req.body.params.songID) })
app.post("/api/addtoplaylist",
    (req, res) => { addToPlaylist(db, res, req.body.params.playlistID, req.body.params.songID) });
app.get("/api/playlists", (req, res) => { getPlaylists(db, res); })
app.post("/api/deleteplaylist", (req, res) => { deletePlaylist(db, res, req.body.params.playlistID); })
app.post("/api/createplaylist", (req, res) => { createPlaylist(db, res, req.body.params.playlist); })
app.get("/api/playlistcontent", (req, res) => { retrievePlaylistContent(db, res, req.query.playlistID); })

// favorites
app.post("/api/unfavorite", (req, res) => { removeFromPlaylist(db, res, 0, req.body.params.songID); })
app.post("/api/favorite", (req, res) => { addToPlaylist(db, res, 0, req.body.params.songID); })
app.get("/api/checkfavorite", (req, res) => { checkFavorite(db, res, req.query.songID); })

// general
app.get("/api/metadata", (req, res) => { getMetadata(db, res, req.query.songID); })
app.get("/api/albumart", (req, res) => { getAlbumArt(db, res, req.query.songID); })
app.get("/api/artists", (req, res) => { retrieveArtists(res); })
app.get("/api/song", (req, res) => { streamSong(db, res, req.query.songID); })
app.get("/api/query", (req, res) => { query(db, res, req.query.searchTerm); })