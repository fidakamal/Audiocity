import sqlite3 from "sqlite3";

const DBSOURCE = "db.sqlite";
const FAVORITESID = 1;

export function removeFromPlaylist(res, playlistID, songID) {
    const query = "DELETE FROM playlist_songs WHERE playlist_id=(?) AND song_id=(?)";
    let db = new sqlite3.Database(DBSOURCE);
    db.run(query, [playlistID, songID], (error, results) => {
        if (error)  return console.error(error.message);
        res.send(results);
    })
    db.close();
}

export function addToPlaylist(res, playlistID, songID) {
    const query = "INSERT INTO playlist_songs VALUES (?, ?)"
    let db = new sqlite3.Database(DBSOURCE);
    db.run(query, [playlistID, songID], (error) => {
        if (error)  return console.error(error.message);
    })
    db.close();
}

export function getPlaylists(res) {
    const query = "SELECT ID, name FROM playlists";
    let db = new sqlite3.Database(DBSOURCE);
    db.all(query, (error, results) => {
        if (error)  return console.error(error.message);
        res.send(results);
    })
    db.close();
}

export function deletePlaylist(res, playlistID) {
    let db = new sqlite3.Database(DBSOURCE);
    db.serialize(function() {
        let query = "DELETE FROM playlist_songs WHERE playlist_id=(?)";
        db.run(query, [playlistID]);
        query = "DELETE FROM playlists WHERE ID=(?)";
        db.get(query, [playlistID], (error, results) => {
            if (error)  return console.error(error.message);
            res.send(results);
        })
    })
    db.close();
}

export function createPlaylist(res, playlistName) {
    const query = "INSERT INTO playlists (name) VALUES (?)";
    let db = new sqlite3.Database(DBSOURCE);
    db.get(query, [playlistName], (error, results) => {
        if (error)  return console.error(error.message);
        res.send(results);
    })
    db.close();
}

export function retrievePlaylistContent(res, playlistID) {
    let db = new sqlite3.Database(DBSOURCE);
    let query = "SELECT ID, title, artist, album, coverpath FROM music_files INNER JOIN playlist_songs ON music_files.id = playlist_songs.song_id WHERE playlist_songs.playlist_id=(?)";
    db.all(query, [playlistID], (error, results) => {
        if (error) return console.error(error.message);
        res.send(results);
    })
    db.close();
}

export function checkFavorite(res, songID) {
    const query = "SELECT * FROM playlist_songs WHERE playlist_id=(?) AND song_id=(?)"
    let db = new sqlite3.Database(DBSOURCE);
    db.get(query, [FAVORITESID, songID], (error, results, fields) => {
        if (error)  return console.error(error.message);
        res.send(!(results === undefined));
    })
    db.close();
}