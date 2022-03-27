import fs from "fs";
import sqlite3 from "sqlite3";

const DBSOURCE = "db.sqlite";

export function retrieveArtists(res) {
    const query = "SELECT artist, coverpath FROM music_files WHERE coverpath != '' GROUP BY artist";
    let db = new sqlite3.Database(DBSOURCE);
    db.all(query, [], (err, results) => {
        if (err)    return console.error(err);
        res.send(results);
    })
    db.close();
}

export function getAlbumArt(res, songID) {
    const query = "SELECT coverpath FROM music_files WHERE ID = (?)";
    let db = new sqlite3.Database(DBSOURCE);
    db.get(query, songID, (error, results) => {
        if (error)  return  console.error(error.message);
        res.send(results)
    })
    db.close();
}

export function getMetadata(res, songID) {
    const query = "SELECT title, artist FROM music_files WHERE ID = (?)";
    let db = new sqlite3.Database(DBSOURCE);
    db.get(query, songID, (error, results) => {
        if (error)  return console.error(error.message);
        res.send(results);
    })
    db.close();
}

export function streamSong(res, songID) {
    const query = "SELECT filepath FROM music_files WHERE ID = (?)";
    let db = new sqlite3.Database(DBSOURCE);
    db.get(query, [songID], (error, results) => {
        if (error)  return console.error(error.message);
        const filePath = results.filepath;
        res.setHeader("content-type", "audio/mpeg");
        fs.createReadStream(filePath).pipe(res);
    })
    db.close();
}

export function query(res, searchTerm) {
    searchTerm = "%" + (searchTerm) + "%";
    let db = new sqlite3.Database(DBSOURCE);
    const query = "SELECT ID, title, artist, album, coverpath FROM music_files WHERE ((title LIKE (?)) OR (artist LIKE (?)) OR (album LIKE (?)))"
    db.all(query, [searchTerm, searchTerm, searchTerm], (error, results, fields) => {
        if (error)  return console.error(error.message);
        res.send(results);
    })
    db.close();
}