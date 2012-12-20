define([
    'dojo/_base/declare',
    'dojo/query',
    'dojox/charting/Chart',
    'dojox/charting/themes/Claro',
], function(declare, query, Chart, theme) {
    return declare(null, {
        constructor: function(bufferSize) {
            this.bufferSize = bufferSize;
            var me = this;
            this.data = [];
            require(['dojox/charting/axis2d/Default',
                     'dojox/charting/plot2d/Lines',
                    ], function(Default, Lines) {
                        me.chart = new Chart("timeseries");
                        me.chart.addPlot("default", {type: Lines});
                        me.chart.addAxis("x", {min: 0, max: 200});
                        me.chart.addAxis("y", {vertical: true, min: 4, max: 10});
                        me.chart.addSeries("y", []);
                        me.chart.render();
                    });
        },

        plot: function(data, channel) {
            if (data[channel]) {
                this.addData(data, channel);
                this.chart.updateSeries("y", this.data);
                this.chart.render();
            }
        },

        addData: function(data, channel) {
            if (this.data.length >= this.bufferSize) {
                this.data.pop();
            }
            this.data.unshift(data[channel]);
        },

        empty: function() {
            this.data = [];
        },

        newChannelBuffer: function(spectraldata, channel) {
            this.empty();
            if (channel > spectraldata[0].length || channel < 0) {
                this.chart.updateSeries("y", this.data);
                this.chart.render();
                return;
            }
            var me = this;
            require(["dojo/_base/array",
            ], function(array) {
                array.forEach(spectraldata, function(item, index) {
                    me.data.push(item[channel]);
                });
            });
        },
        
    });
});
