/* global ISODate, parseISODate, moment, Chart, Image */
( function() {

Chart.pluginService.register({
    beforeDraw: function (chart, easing) {
        
        if ( chart.config.options.chartArea ) {
            var ctx = chart.chart.ctx;
            var chartArea = chart.chartArea;
            var options = chart.config.options.chartArea;
            
            var width = chartArea.right - chartArea.left;
            var height = ( chartArea.bottom - chartArea.top ) / 6;
            
            console.log( width, height );
            ctx.save();
            ctx.fillStyle = options.danger;
            ctx.fillRect( chartArea.left, chartArea.top, width, height );
            ctx.fillStyle = options.warning;
            ctx.fillRect( chartArea.left, chartArea.top + height, width, height );
            ctx.fillStyle = options.good;
            ctx.fillRect( chartArea.left, chartArea.top + ( height * 2 ), width, height );
            ctx.restore();
        }
    }
});

            
function suggestMinMax( series ) {
    
    var values = series.map( x => x.y );
    var ymin = Math.min.apply( Math, values );
    var ymax = Math.max.apply( Math, values );
    var yspread = ymax - ymin;
    return {
                        
        suggestedMin: ymin - yspread / 3,
        suggestedMax: ymax + yspread / 3
        
    };
    
}

window.updateChart = function updateChart( chart, liveValue ) {
    
    var livePoint = chart.data.datasets[ 0 ].data.find( function( point ) { return point.live; } );
    if ( livePoint ) {
        
        livePoint.y = liveValue ? Number( liveValue ) : NaN;
        chart.update();
        
    }
    
};

window.pointImage = new Image();
window.pointImage.src = "/pin-up.png";
window.pointImage.style.width = "20px";

window.renderChart = function renderChart( ctx, options ) {
    
    var uid = options.uid;
    if ( !uid ) { throw new Error( "renderChart options missing uid" ); }
    var weighins = options.weighins;
    if ( !weighins ) { throw new Error( "renderChart options missing weighins" ); }
    var sortedWhens = options.sortedWhens;
    if ( !sortedWhens ) { throw new Error( "renderChart options missing sortedWhens" ); }
    
    var liveWhen = options.liveWhen;
    var liveValue = options.liveValue;
    
    function recordFor( forWhen ) {
        
        if ( liveWhen && ( forWhen === ISODate( liveWhen ) )  ) { 
            
            return {
                
                numeric: liveValue ? Number( liveValue ) : undefined
                
            };
            
        }
        var thisWeighin = weighins[ forWhen ] || {};
        return ( thisWeighin.participants || {} )[ uid ];
        
    }
    
    var series = sortedWhens.map( function( w ) { return {
            
        x: parseISODate( w ),
        y: ( recordFor( w ) || {} ).numeric,
        live: liveWhen && w === ISODate( liveWhen )
    
    }; } );
    var xvalues = series.map( x => x.x );
    
    var maxDate = new Date(8640000000000000);
    var minDate = new Date(-8640000000000000);  
    
    var xmin = options.xmin || xvalues.reduce( function( can, value ) { return value < can ? value : can }, maxDate );
    var xmax = options.xmax || xvalues.reduce( function( can, value ) { return value > can ? value : can }, minDate );

    return new Chart( ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            
            labels: series.map( function( point ) { return console.log( point ) || moment( point.x ).format( "Do MMM"); } ),
            datasets: [ {
                
                label: "Weight",
                fill: false,
                backgroundColor: '#083d77',
                borderColor: '#fe5f55',
                data: series,
                lineTension: 0.25,
                pointRadius: 7,
                pointHoverRadius: 7,
                pointBorderColor: "#083d77",
                pointHitRadius: 20,
                pointStyle: window.pointImage
                
            } ]
            
        },
    
        // Configuration options go here
        options: {
            
            tooltips: {
            
                callbacks: {
                    
                    title: function( item ) {
                        
                        return moment( item.xLabel ).format( "dddd, MMMM Do" );
                        
                    }
                    
                }
                
            },
            scales: {
                
                yAxes: [ {
                    
                    type: "linear",
                    offset: true,
                    ticks: Object.assign( {}, suggestMinMax( series ) )
                    
                } ],
                xAxes: [ {
                  
                    type: "time",
                    time: {
                        
                        min: xmin,
                        max: xmax,
                        unit: "week",
                        minUnit: "day",
                        displayFormats: {
                            
                            week: "Do MMM"
                            
                        }
                        
                    },
                    ticks: {
                        
                        source: "auto"
                        
                    }
                    
                } ]
                
            },
            chartArea: {
                
                danger: "rgba( 255, 0, 0, 0.4 )",
                warning: "rgba( 255, 0, 0, 0.1 )",
                good: "transparent"
            
            }   
            
        }
        
    });
    
};

}() );
