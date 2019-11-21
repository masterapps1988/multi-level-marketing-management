(function() {

'use strict';

// Auth
angular.module('app').controller('DashboardController', DashboardController);

function DashboardController($stateParams, ApiService, StateFactory, FlashMessageService) {
  var $scope = this;

  this.loading = new StateFactory.Boolean;
  this.error = new StateFactory.Boolean;
  this.errorMessage = null;
  this.successMessage = null;
  this.fm = FlashMessageService;

  // list
  this.year = null;
  this.customerApproval = null;
  this.totalCustomer = null;
  this.totalHistoryEarning = null;
  this.totalMPin = null;
  this.totalMPinPerMonth = null;
  this.totalUtilizationMPinPerMonth = null;
  this.compareInvoice = null;
  this.revenueMonthly = null;

  // param
  this.param = {
    year: null
  };

  this.init = function() {
      var m = [ "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December" ];

      var year = new Date().getFullYear();
      
      var monthInt = {start_date: year+'/'+((new Date().getMonth() + 1) < 10 ? '0'+(new Date().getMonth() + 1) : (new Date().getMonth() + 1))+'/01', end_date: year+'/'+((new Date().getMonth() + 1) < 10 ? '0'+ (new Date().getMonth() + 1) : (new Date().getMonth() + 1))+'/'+new Date(year, (new Date().getMonth() + 1), 0).getDate()};
      this.day = new Date(year, (new Date().getMonth() + 1), 0).getDate();
      this.monthInt = [];
      this.year = [];
      this.month = [];
      this.year.push(year);
      this.monthInt.push(monthInt);
      this.month.push(m[(new Date().getMonth() )]);

      for (var i = 1; i < 5; i++) {
        this.year.push(year - i);
      }

      for (var i = 1; i < 7; i++) {
        var dd = '01';
        var ddEnd = new Date(year, (new Date().getMonth() + 1) - i, 0).getDate();
        var mm = ((new Date().getMonth() + 1)) - i;
        var yyyy = year;
        
        if(mm<10) 
        {
            mm='0'+mm;
        }
        
        this.monthInt.push({start_date: yyyy+'/'+mm+'/'+dd, end_date: yyyy+'/'+mm+'/'+ddEnd})
        this.month.push(m[new Date().getMonth() - i]);
      }
      
      ApiService.Account.Status.count().then(function(resp) {
          var data = resp.data;
          
          $scope.customerApproval = data.data;
          $scope.percentStatusStyleMember = ((data.data.total - data.data.total_pending) / data.data.total * 100)+'%';
      });

      ApiService.Customer.count().then(function(resp) {
          var data = resp.data;
          
          $scope.totalCustomer = data.data;
      });

      ApiService.Profit.DownlineEarning.count().then(function(resp) {
        var data = resp.data;
        
        $scope.totalHistoryEarning = data.data;
      });

      ApiService.Account.Mpin.count().then(function(resp) {
        var data = resp.data;
        
        $scope.totalMPin = data.data;
        $scope.percentMpinStyleMember = ((data.data.total - data.data.total_pending) / data.data.total * 100)+'%';
      });

      ApiService.Account.Mpin.count_per_month({month: $scope.monthInt}).then(function(resp) {
        $scope.loading.on();
        if(!resp.data.is_error) {
          var data = resp.data;

          $scope.totalMPinPerMonth = data.data.total;

          ApiService.Account.Mpin.count_utilization_per_month({month: $scope.monthInt}).then(function(resp) {
            $scope.loading.on();
            if(!resp.data.is_error) {
              var data = resp.data;
    
              $scope.totalUtilizationMPinPerMonth = data.data.total;
              $scope.setChartArea();
            }
          });
        }
      });
  };

  this.setChartArea = function() {
    // -----------------------
    // - MONTHLY SALES CHART -
    // -----------------------
    var salesChart       = new Chart($('#salesChart').get(0).getContext('2d'));

    var salesChartData = {
      labels  : this.month,
      datasets: [
        {
          label               : 'Penggunaan Mpin',
          fillColor           : 'rgb(0, 166, 90)',
          strokeColor         : 'rgb(0, 166, 90)',
          pointColor          : 'rgb(0, 166, 90)',
          pointStrokeColor    : '#00a65a',
          pointHighlightFill  : '#fff',
          pointHighlightStroke: 'rgb(220,220,220)',
          data                : $scope.totalUtilizationMPinPerMonth
        },
        {
          label               : 'MPIN',
          fillColor           : 'rgba(60,141,188,0.9)',
          strokeColor         : 'rgba(60,141,188,0.8)',
          pointColor          : '#3b8bba',
          pointStrokeColor    : 'rgba(60,141,188,1)',
          pointHighlightFill  : '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data                : $scope.totalMPinPerMonth
        }
      ]
    };

    var salesChartOptions = {
      // Boolean - If we should show the scale at all
      showScale               : true,
      // Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines      : false,
      // String - Colour of the grid lines
      scaleGridLineColor      : 'rgba(0,0,0,.05)',
      // Number - Width of the grid lines
      scaleGridLineWidth      : 1,
      // Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      // Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines  : true,
      // Boolean - Whether the line is curved between points
      bezierCurve             : true,
      // Number - Tension of the bezier curve between points
      bezierCurveTension      : 0.3,
      // Boolean - Whether to show a dot for each point
      pointDot                : false,
      // Number - Radius of each point dot in pixels
      pointDotRadius          : 4,
      // Number - Pixel width of point dot stroke
      pointDotStrokeWidth     : 1,
      // Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,
      // Boolean - Whether to show a stroke for datasets
      datasetStroke           : true,
      // Number - Pixel width of dataset stroke
      datasetStrokeWidth      : 2,
      // Boolean - Whether to fill the dataset with a color
      datasetFill             : true,
      // String - A legend template
      legendTemplate          : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<datasets.length; i++){%><li><span style=\'background-color:<%=datasets[i].lineColor%>\'></span><%=datasets[i].label%></li><%}%></ul>',
      // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio     : true,
      // Boolean - whether to make the chart responsive to window resizing
      responsive              : true
    };

    // Create the line chart
    salesChart.Line(salesChartData, salesChartOptions);
    $scope.loading.off();
  }
};
})();
