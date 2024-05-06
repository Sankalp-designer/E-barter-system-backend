import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed');
      return res.sendStatus(403);
    }
    req.user = user;
    console.log('User authenticated:', user);
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log('Unauthorized access');
      return res.status(403).json({ message: 'Unauthorized' });
    }
    console.log('User authorized');
    next();
  };
};


export {authenticateToken, authorizeRole};
