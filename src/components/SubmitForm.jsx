import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SubmitForm({ onSuccess, coords }) {
  const [type, setType] = useState('album_cover');
  const [formData, setFormData] = useState({
    artist_name: '',
    title: '',
    song_name: '',
    album_name: '',
    release_year: '',
    wikipedia_link: '',
    description: '',
    cover_type: 'album',
    youtube_url: '',
    timestamp: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !coords) return alert('Must be logged in and select a location.');

    setUploading(true);

    let image_url = null;
    if (imageFile) {
      const filename = `${Date.now()}_${imageFile.name}`;
      const path = `covers/${filename}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(path, imageFile);

      console.log('Upload response:', { data, error });

      if (error) {
        alert('Error uploading image: ' + error.message);
        setUploading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from('images')
        .getPublicUrl(path);
      image_url = publicUrl.publicUrl;
    }

    const payload = {
      submission_type: type,
      user_id: userId,
      artist_name: formData.artist_name,
      release_year: parseInt(formData.release_year),
      latitude: coords.lat,
      longitude: coords.lng,
      wikipedia_link: formData.wikipedia_link || null,
      description: formData.description || null,
      image_url,
      street_view_url: `https://www.google.com/maps?q=&layer=c&cbll=${coords.lat},${coords.lng}`,
    };

    if (type === 'album_cover') {
      payload.cover_type = formData.cover_type;
      payload.title = formData.title;
    } else {
      payload.song_name = formData.song_name;
      payload.album_name = formData.album_name;
      payload.youtube_url = formData.youtube_url;
      payload.timestamp = formData.timestamp;
    }

    const { error } = await supabase.from('submissions').insert([payload]);
    setUploading(false);
    if (error) {
      alert('Error saving submission.');
    } else {
      alert('Submission successful!');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="space-y-4 mt-8 text-sm">
      <h2 className="text-lg font-bold">Submit a Location</h2>

      <div>
        <label>Submission Type</label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-1 border rounded"
        >
          <option value="album_cover">Album/Single Cover</option>
          <option value="music_video">Music Video Location</option>
        </select>
      </div>

      <div>
        <label>Artist Name</label>
        <input
          type="text"
          name="artist_name"
          value={formData.artist_name}
          onChange={handleChange}
          className="w-full p-1 border rounded"
        />
      </div>

      {type === 'album_cover' && (
        <>
          <div>
            <label>Album/Single Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label>Type</label>
            <select
              name="cover_type"
              value={formData.cover_type}
              onChange={handleChange}
              className="w-full p-1 border rounded"
            >
              <option value="album">Album</option>
              <option value="single">Single</option>
            </select>
          </div>
        </>
      )}

      {type === 'music_video' && (
        <>
          <div>
            <label>Song Name</label>
            <input
              type="text"
              name="song_name"
              value={formData.song_name}
              onChange={handleChange}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label>Album Name (optional)</label>
            <input
              type="text"
              name="album_name"
              value={formData.album_name}
              onChange={handleChange}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label>YouTube URL</label>
            <input
              type="url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleChange}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label>Timestamp (optional)</label>
            <input
              type="text"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleChange}
              className="w-full p-1 border rounded"
              placeholder="e.g. 1:23"
            />
          </div>
        </>
      )}

      <div>
        <label>Release Year</label>
        <input
          type="number"
          name="release_year"
          value={formData.release_year}
          onChange={handleChange}
          className="w-full p-1 border rounded"
        />
      </div>

      <div>
        <label>Wikipedia Link (optional)</label>
        <input
          type="url"
          name="wikipedia_link"
          value={formData.wikipedia_link}
          onChange={handleChange}
          className="w-full p-1 border rounded"
        />
      </div>

      <div>
        <label>Description (optional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-1 border rounded"
        />
      </div>

      <div>
        <label>Upload Cover Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div>
        <label>Selected Location</label>
        <div className="p-2 bg-gray-100 rounded text-sm text-gray-800">
          {coords
            ? `Latitude: ${coords.lat}, Longitude: ${coords.lng}`
            : 'Click a location on the map to select it'}
        </div>
      </div>

      <button
        disabled={uploading}
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 mt-2"
      >
        {uploading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
