class ProfileController 
{
  index(req, res)
  {
    return res.render('profile/index', { error: 'This method is not ready yet'});
  }
}

module.exports = new ProfileController();

