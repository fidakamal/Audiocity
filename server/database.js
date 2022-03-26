import sqlite3 from "sqlite3";
import fs from "fs";

const DBSOURCE = "db.sqlite";
const artDir = "./Album Art/";

export function initDB() {
    let db = new sqlite3.Database(DBSOURCE);
    db.serialize(function() {
        const query = "CREATE TABLE IF NOT EXISTS music_files (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, album TEXT, filepath TEXT, coverpath TEXT)";
        db.run(query);
    })
    db.close();
}

export function resetDB() {
    fs.rmSync(artDir, { recursive: true, force: true });
    let query1 = "DELETE FROM music_files";
    let query2 = "DELETE FROM sqlite_sequence WHERE name='music_files'";
    let db = new sqlite3.Database(DBSOURCE);
    db.serialize(() => {
        db.run(query1, (error) => {
            if (error)  console.error(error.message);
        })
        db.run(query2, (error) => {
            if (error)  console.error(error.message);
        })
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