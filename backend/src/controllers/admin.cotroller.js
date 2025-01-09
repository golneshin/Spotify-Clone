import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import cloudinary from "../db/cloudinary.js";

// Check Admin
export const checkAdmin = async (req, res, next) => {
  res.status(200).send("Admin check successful.");
};

// Upload to Cloudinary handler
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      folder: "spotify-clone",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// Create Song
export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile)
      return res.status(400).send("No files were uploaded.");

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      albumId: albumId || null,
      duration,
      audioUrl,
      imageUrl,
    });

    await song.save();

    // if song belongs to an album, updates the album's song array.
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    res.status(201).json(song);
  } catch (error) {
    console.error("Error in creating song", error);
    next(error);
  }
};

// Delete Song
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findByIdAndDelete(id);

    if (!song) return res.status(404).send("Song not found.");

    // if song belongs to an album, removes the song from the album's song array.
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: id },
      });
    }

    res.status(200).send("Song deleted successfully.");
  } catch (error) {
    console.error("Error in deleting song", error);
    next(error);
  }
};

// Create Album
export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseDate } = req.body;
    const imageFile = req.files.imageFile;
    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      releaseDate,
      imageUrl,
    });

    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.error("Error in creating album", error);
    next(error);
  }
};

// Delete Album
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const album = await Album.findByIdAndDelete(id);
    if (!album) return res.status(404).send("Album not found.");

    await Song.deleteMany({ albumId: id });

    res.status(200).send("Album deleted successfully.");
  } catch (error) {
    console.error("Error in deleting album", error);
    next(error);
  }
};
