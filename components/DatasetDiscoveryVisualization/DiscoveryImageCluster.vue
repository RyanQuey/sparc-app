<template>
  <div v-loading="isLoading" class="">
    <generic-vega
      v-if="true || isVegaLoaded && isVegaEmbedLoaded"
      :dataForChart="dataUsedInChart"
      :elementId="'discovery-image-cluster'"
      :exampleImgURL="exampleImgURL"
      :generateScatterplotSpec="generateScatterplotSpec"
    />
  </div>
</template>

<script>
import GenericVega from '@/components/DatasetDiscoveryVisualization/GenericVega.vue'
import { 
  checkCacheForESRecord
}  from './graphUtils.js'

import { generateDefaultScatterplotSpec } from '@/components/DatasetDiscoveryVisualization/chartUtils.js'
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


export default {
  name: 'DiscoveryImageCluster',
  components: {
    GenericVega,
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
    isLoading: {
      type: Boolean,
      default: false
    },
    // make sure to not to try to render vega until loaded
    isVegaLoaded: {
      type: Boolean,
      default: false
    },
    isVegaEmbedLoaded: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      // what we actually send to chart...so we don't have to retrieve from osparc everytime we refresh necessarily
      // ie adds a layer of abstraction from the store, so store stays always in line wiwth osparc data, but we can do what we want in frontend
      dataUsedInChart: {},
      exampleImgURL: "https://www.unisza.edu.my/iacbe2017/images/theme/notyetavailablekyle.jpg",
      generateScatterplotSpec: generateDefaultScatterplotSpec,
    }
  },

  watch: {
    datasetsInfo: {
      immediate: true,
      handler (values, oldValues) {
        console.log("refreshing visualization...")
        this.refreshVisualization(values)
      }
    },
  },

  computed: {
    osparcDataForChart () {
      const base = this.$store.state.datasetComparison.osparcResults
      // not doing for now
      // const computed = base && base.outputs.output1.keywords
      return {}
    },
  },

  methods: {
    /**
    * takes the updated data and updates the visualization
    */
    updateVis (osparcDataForChart) {
      console.log("updateing vis")
      // updates this, which sends it down to props, triggering a chart refresh
      this.dataUsedInChart = osparcDataForChart
    },

    // receives relevant data (as computed by the computed field) and sets to chart
    async refreshVisualization () {
      this.$emit('loading')

      try {
        const dataForUpdate = this.osparcDataForChart
        this.updateVis(dataForUpdate)

        this.$emit('notLoading')

      } catch (err) {
        console.error(err)
        this.$emit('notLoading')
        
      }

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
