var q = function() {
  this.date = function(date) {
      return moment(date).format('YYYY-MM-DD');
  };
};
var DateFormatter = new q();