// Prevent unauthorized access to protected resources
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  },
  // // for login
  // enAuthenticated: function(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     res.redirect('/dashboard');
  //   }
    
  //   res.redirect('/users/login');
  // }
};