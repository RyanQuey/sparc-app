<template>
  <div class="vega-chart-wrapper">
    <div v-if="exampleImgURL" class="mock-data-image-wrapper">
      <img class="mock-data-image" :src="exampleImgURL" />
    </div>

    <div v-if="!exampleImgURL" :id="elementId"></div>
  </div>
</template>

<script>

// This is the chart to use for all the osparc related charts


// following this: https://vega.github.io/vega/examples/force-directed-layout/
import {
  assocPath,
  clone,
  compose,
  defaultTo,
  equals,
  flatten,
  find,
  filter,
  head,
  mergeLeft,
  pathOr,
  propEq,
  propOr,
  pluck
} from 'ramda'
export default {
  name: 'GenericVega',

  mounted: function() {
    this.refreshVis()
  },
  watch: {
    dataForChart: {
      immediate: true,
      handler (values, oldValues) {
        this.refreshVis(values)
      }
    },
  },

  props: {
    /**
    * info about each dataset we're comparing
    * - has two keys, nodes nad edges
    * - keep it one prop, since they should always be sent together, and so triggers / watchers know which one prop to watch
    *
    */
    dataForChart: {
      type: Object,
      default: () => [],
    },
    elementId: {
      type: String,
    },
    exampleImgURL: {
      type: String,
    },
    generateSpec: {
      type: Function,
    },
  },

  data() {
    return {
      isReady: false,
    }
  },

  computed: {
  },

  methods: {
    // reloads the current data into the chart, refreshing the chart
    async refreshVis () {
      // NOTE !!! The key is that edges will be changed dynamically by the path transform. Need to clone this or something to make sure that links don't get stuck with their original values
      if (this.exampleImgURL) {
        console.log("sending mock image instead")
        return
      }

      if (!this.dataForChart) {
        console.log("no data yet, just wait")
        return
      }

      console.log(this.elementId, "using data", this.dataForChart) 
      const vegaSpec =  clone(this.generateSpec(this.dataForChart))

      console.log("refreshing vega chart")
      console.log("vega spec", vegaSpec)
      this.isReady = false

      const options = {
        renderer:  'svg',  // renderer (canvas or svg)
        // only for vega embed I believe, not regular vega

        // add a tooltip for allowing on hover stuff
        tooltip: {theme: 'dark'},
        config: {
          axis: {
            // doesn't allow the labels to overlap like I want
            //labelOverlap: false,
          }
        },
        actions: {
          export: true, 
          // beacuse it's broken...
          // TODO fix, seems to be from the marks, since commenting those out makes it work. 
          source: false,
          // beacuse it's broken...
          editor: false,
        },
        // hover:     true,       // enable hover processing
      }

      // vegaEmbed should be global, pulled from cdn
      // NOTE another way to get around this is to call window from the mounted or beforeMount hooks only. But then we might have trouble when trying to refresh the graph...
      try {
        // render vega to teh target element
        const result = await vegaEmbed(`#${this.elementId}`, vegaSpec, options)

        // result.view provides access to the Vega View API
        this.isReady = true
        console.log("Full vega spec for ", this.elementId,result)

        // find out what data actually got into our chart
        const dataUsed = result.vgSpec.data

      } catch (err) {
        console.error(err)
      }


      // if using vega view without vega embed
      // console.log(vegaSpec)
      // let view = new vega.View(vega.parse(vegaSpec), options)
      // view.runAsync();
    }
  }
}
</script>

<style lang="scss" scoped>
.vega-chart-wrapper {
  display: flex;
  justify-content: center;
}
</style>
</script>

