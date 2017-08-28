<template>
  <div>
    <v-card class='white ma-4'>
      <v-card-title class=''>
        <h6 class='headline title'>Patient 345-BTW</h6>
        <v-spacer></v-spacer>
        <v-btn large class='button' icon href='/'><v-icon>close</v-icon></v-btn>
      </v-card-title>
      <v-card-text class='chart-holder'>
        <div id='demo'></div>
      </v-card-text>
      <v-card-actions>
        <v-divider></v-divider>
        <v-spacer></v-spacer>

        <v-btn icon warning large
          @click.native='pausePlayback' class='white--text' v-if='playingData'>
          <v-icon>pause</v-icon>
        </v-btn>
        <v-btn icon primary large
          class='white--text' v-else @click.native='startPlayback'>
          <v-icon>play_arrow</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

  </div>
</template>

<script>

export default {
  data () {
    return {
      chartData: [],
      dataBuffer: [],
      dataPtr: 0,
      playingData: false
    }
  },

  methods: {
    pausePlayback() {
        this.playingData = false
    },
    startPlayback() {
      this.playingData = true
      setTimeout(this.addDataPoints, 100)
    },
    addDataPoints() {
      var start = this.dataPtr
      for (var k=0; k<10; k++) {
        this.chartData.shift()
        this.chartData.push(this.dataBuffer[this.dataPtr])
        this.dataPtr += 1
        if (this.dataPtr == this.bufferLength) {
          this.dataPtr = 0
          while (this.chartData.length>0) {
            this.chartData.shift()
          }
          this.populateChart()
        }
      }
      if (this.playingData) {
        setTimeout(this.addDataPoints, 100)
      }
      this.chart.render()
    },
    populateChart() {
      console.log('Populating the chart.')
      var self = this
      axios.get('static/demo.json').then(function(resp) {
        self.dataBuffer = resp.data
        var maxPts = 250
        for (var k=0; k<maxPts; k++) {
          self.chartData.push(resp.data[k])
          self.dataPtr += 1
        }
        self.chart.render()
      })
    }
  },

  computed: {
    bufferLength() {
      return this.dataBuffer.length
    }
  },

  mounted() {
    // Build our chart.
    this.chart = new CanvasJS.Chart('demo', {
      theme: 'theme1' ,
      height: 275,
      axisX: {
        gridColor: 'lightGray',
        gridThickness: 1,
        title: 'Elapsed Time (seconds)',
        titleFontFamily: 'Avenir Next',
        titleFontSize: 14,
        labelFontSize: 14,
        interval: 0.50,
        intervalType: 'seconds'
      },
      axisY: {
        title: 'Amplitude (voltage)',
        titleFontFamily: 'Avenir Next',
        gridThickness: 1,
        titleFontSize: 14,
        labelFontSize: 14,
      },
      data: [
        {
          type: "spline",
          lineColor: '#3C78CD',
          dataPoints: this.chartData
        }]
    })
    this.chart.render()
    this.populateChart()
  }

}
</script>

<style>
html, body {
  overflow-y: hidden !important;
}
.title {
  margin-bottom: 0px;
}
.button {
  color: white;
  background-color: #305580;
}
.chart-holder {
  padding: 25px;
  height: 280px;;
}
</style>
