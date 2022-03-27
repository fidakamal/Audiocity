import fs from "fs";
import {addSong, resetDB} from "./database.js";
import metadata from "music-metadata";
import { nanoid } from 'nanoid';

const ARTDIR = "./Album Art/";

function generateFileName() {
    var fileName = nanoid() + '.png';
    while (fs.existsSync('./Music Files/' + fileName))  newName = nanoid() + '.png';
    return fileName;
}

function saveFile(filepath, tags) {
    let coverPath = "";
    if (tags.picture) {
        if (!fs.existsSync(ARTDIR)) fs.mkdirSync(ARTDIR);
        coverPath = generateFileName();
        fs.writeFile(ARTDIR + coverPath, tags.picture[0].data, () => {});
    }
    return addSong(tags.title, tags.artist, tags.album, filepath, coverPath);
}

async function getTags(filepath) {
    let tags = null;
    let file_type = filepath.split(".").pop();
    if (file_type === "mp3" || file_type === "flac") {
        await metadata.parseFile(filepath).then((data) => {
            tags = data.common;
            return tags;
        }).catch((error) => {
            console.error(error);
        });
    }
    return tags;
}

export async function getMusic(dir, reset = false) {
    if(reset)   resetDB();
    let list = fs.readdirSync(dir);
    for (let filepath of list) {
        filepath = dir + '/' + filepath;
        let stat = fs.statSync(filepath);
        if (stat && stat.isDirectory()) await getMusic(filepath);
        else {
            let tags = await getTags(filepath);
            let saved = false;
            if (tags != null)   saved = saveFile(filepath, tags);
            if (!saved)  console.log("Failed to save file: " + filepath);
        }
    }
}