
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { pretty: true, title: 'Rainbow Socket Sketch - by Kyle Phillips' })
};