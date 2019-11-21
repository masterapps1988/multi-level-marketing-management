var OrderBy = function() {
    this.data = {
      columnName: null,
      order: true // True mean asc, false mean desc
    };

    /* Set column that need to be sorted. This method automatically set
     * default ordered(asc | desc).
     */
    this.setColumn = function(columnName) {
      if(this.data.columnName == columnName) {
          this.data.order = !this.data.order;
      } else {
          this.data.order = true;
      }

      this.data.columnName = columnName;
    };


    this.getClass = function(columnName) {
        var order = ' ';

        if(this.data.columnName == columnName) {
            order = this.data.order ? 'asc' : 'desc';
        }

        return order;
    };

    this.toString = function() {
        var column = this.data.columnName, order = this.data.order;
        var result = null;

        if(column !== null && order !== null) {
            result = column + ':' + (order ? 'asc' : 'desc');
        }

        return result;
    };
};