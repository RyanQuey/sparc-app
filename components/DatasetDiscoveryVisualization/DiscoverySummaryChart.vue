<template>
  <div v-loading="!osparcDataForChart" class="">
    <div v-if="osparcDataForChart" class="">
      <generic-plotly
        :osparcData="osparcDataForChart"
        :elementId="'discovery-summary-table'"
        :generateSpec="generateSpec"
      />
    </div>
  </div>
</template>

<script>
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
  prop,
  propOr,
  pluck,
  uniqBy,
} from 'ramda'


import GenericPlotly from '@/components/DatasetDiscoveryVisualization/GenericPlotly.vue'
import { generateSummaryTableSpec } from '@/components/DatasetDiscoveryVisualization/chartUtils.js'

export default {
  name: 'DiscoverySummaryChart',
  components: {
    GenericPlotly,
  },

  props: {
    /**
    * info about each dataset we're comparing
    *
    */
    datasetsInfo: {
      type: Array,
      default: () => []
    },

    // make sure to not to try to render plotly until loaded
    isPlotlyLoaded: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      // what we actually send to chart...so we don't have to retrieve from osparc everytime we refresh necessarily
      // ie adds a layer of abstraction from the store, so store stays always in line wiwth osparc data, but we can do what we want in frontend
      generateSpec: generateSummaryTableSpec,

    }
  },

  watch: {
  },

  computed: {
    test () {
      const base = this.$store.state.datasetComparison.osparcResults
      const computed = base

      console.log("TEST summary chart data", computed)
      return computed
    },
    osparcDataForChart () {
      const base = this.$store.state.datasetComparison.osparcResults
      const computed = base ? base.outputs.output1["summary table"] : null

      console.log("summary chart data", computed)
      return clone(computed)
    },
  },

  methods: {
    /**
    * takes the updated data and updates the visualization
    */
    // updateVis (osparcDataForChart) {
    //   console.log("updateing vis")
    //   // updates this, which sends it down to props, triggering a chart refresh
    //   this.dataUsedInChart = osparcDataForChart
    // },

    // // receives relevant data (as computed by the computed field) and sets to chart
    // async refreshVisualization () {
    //   this.$emit('loading')

    //   try {
    //     const dataForUpdate = this.osparcDataForChart
    //     this.updateVis(dataForUpdate)

    //     this.$emit('notLoading')

    //   } catch (err) {
    //     console.error(err)
    //     this.$emit('notLoading')
    //     
    //   }

    // }
  }
}
</script>

<style lang="scss" scoped>
</style>
