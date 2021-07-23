<template>
  <div v-loading="isLoading || !osparcDataForChart" class="">
  	<div class="chart-images">
      <div class="chart-images-wrapper">
        <div class="chart-image">
          <img class="" :src="apiImageUrlBase()" />
        </div>
      </div>
    </div>
    {{ osparcDataForChart }}
  </div>
</template>

<script>
import DiscoveryGraphVega from '@/components/DatasetDiscoveryVisualization/DiscoveryGraphVega.vue'
import { 
  elasticsearchRecordToGraphEntities,
  pennsieveRecordToGraphEntities,
}  from './graphUtils.js'

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
  name: 'DiscoveryGraph',
  components: {
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
    }
  },

  watch: {
  },

  computed: {
    osparcDataForChart () {
      const base = this.$store.state.datasetComparison.osparcResults
      const computed = base && base.outputs.output1.abstract

      return computed
    },
    pythonOsparcJobId () {
      const base = this.$store.state.datasetComparison.osparcResults
      return base && base.job_id
    },
  },

  methods: {
    apiImageUrlBase () { 
      // for now, only one image, so no need for a param

      const jobId = this.pythonOsparcJobId
      if (!jobId) {
        return false
      }

      const image_name = "Correlation_heatmap.png"
      return `${process.env.flask_api_host}/api/results-images/${jobId}/${image_name}`


    },
  }
}
</script>

<style lang="scss" scoped>
.chart-images {
  // TODO make mobile friendly
  max-width: 100%;
  .chart-images-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .chart-image {
      padding: 1rem;
      box-sizing: border-box;
      max-width: 50%;

      img {
        max-width: 100%;
      }
    }
  }
}
</style>
