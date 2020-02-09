class ChefValidator
{
  post(req, res, next)
  {
    let avatarFilename = null;
    let avatarPath = null;

    if (req.files.length > 0)
    {
      const { filename, path } = req.files[0];

      avatarFilename = filename || null;
      avatarPath = path || null;
    }

    req.avatar = { filename: avatarFilename, path:  avatarPath};

    return next();
  }
}

module.exports = new ChefValidator();