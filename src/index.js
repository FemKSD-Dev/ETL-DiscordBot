const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL
const VALID_TOKEN = process.env.SECRET_TOKEN

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/notify', async (req, res) => {
  const { message } = req.body
  const token = req.headers['authorization']

  if(!token || token !== VALID_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token.' })
  }

  if(!message) {
    return res.status(400).json({ error: 'Message are required.'})
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to send webhook.' });
    }

    res.status(200).json({ success: true, message: 'Webhook sent successfully!' });
  } catch (error) {
    console.error('Error sending webhook:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
})

app.get('/', (req, res) => {
  res.send('<span>Discord bot notifications for ETL</span>');
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
})