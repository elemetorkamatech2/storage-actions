const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'a2b1c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2');
    const { userId } = decodedToken;
    console.log(userId);
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error('Invalid user ID');
    } else {
      next();
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
    } else if (error.message === 'Invalid user ID') {
      res.status(401).json({ error: 'Invalid user ID' });
    } else {
      res.status(401).json({ error: 'Invalid request!' });
    }
  }
};

const payload = { userId: 'user123' };
const secretKey = 'a2b1c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2';
const options = { expiresIn: '1h' };

const token = jwt.sign(payload, secretKey, options);
console.log(token);
