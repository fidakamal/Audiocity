import sqlite3 from "sqlite3";
import fs from "fs";

const DBSOURCE = "db.sqlite";
const artDir = "./Album Art/";

export function initDB() {
    let db = new sqlite3.Database(DBSOURCE);
    db.serialize(function() {
        let query = "CREATE TABLE IF NOT EXISTS music_files (ID INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, album TEXT, filepath TEXT, coverpath TEXT)";
        db.run(query);
        query = "CREATE TABLE IF NOT EXISTS playlists (ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, UNIQUE (ID, name))";
        db.run(query);
        query = "INSERT INTO playlists (id, name) VALUES(1, 'Favorites')";
        db.run(query, (error) => {if(error){}});
        query = "CREATE TABLE IF NOT EXISTS playlist_songs (playlist_id INTEGER, song_id INTEGER, PRIMARY KEY (playlist_id, song_id))";
        db.run(query);
    })
    db.close();
}

export function resetDB() {
    fs.rmSync(artDir, { recursive: true, force: true });
    let db = new sqlite3.Database(DBSOURCE);
    db.serialize(() => {
        let query = "DELETE FROM music_files";
        db.run(query);
        query = "DELETE FROM sqlite_sequence WHERE name='music_files'";
        db.run(query);
    });
    db.close();
}

export function addSong(title, artist, album, filepath, coverPath) {
    let query = "INSERT INTO music_files (title, artist, album, filepath, coverpath) VALUES (?, ?, ?, ?, ?)";
    let db = new sqlite3.Database(DBSOURCE);
    db.serialize(() => {
        db.run(query, [title, artist, album, filepath, coverPath], (error) => {
            if (error) {
                console.error(error.message);
                return false;
            }
        });
    });
    db.close();
    return true;
}