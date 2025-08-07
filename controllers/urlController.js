const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) return res.status(400).json({ error: 'Original URL required' });

  try {
    let url = await Url.findOne({ originalUrl });
    if (url) return res.json(url);

    const shortId = nanoid(8);
    const newUrl = new Url({ originalUrl, shortId });
    await newUrl.save();

    res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const redirectShortUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });

    if (!url) return res.status(404).json({ error: 'URL not found' });

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = { createShortUrl, redirectShortUrl };
