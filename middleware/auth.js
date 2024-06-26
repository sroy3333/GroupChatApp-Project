const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    console.log('Verified user:', req.user);
    next();
  } catch (err) {
    console.log('Invalid token:', err.message);
    res.status(400).json({ error: 'Invalid token' });
  }
};