const ContactMessage = require('../models/contact.model');

exports.createMessage = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      subject,
      services = [],
      message,
      termsAccepted
    } = req.body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      subject,
      services,
      message,
      termsAccepted: !!termsAccepted
    });

    await newMessage.save();

    return res.status(201).json({ message: 'Message received. Thank you!' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    return res.status(500).json({ message: 'Failed to save message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
}; 