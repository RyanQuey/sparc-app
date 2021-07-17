import createClient from '~/plugins/contentful'
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

export const state = () => ({
  // array of datasets to compare
  toCompare: [
    // {
    //   name: "Vagus Dataset 1",
    //   id: "156",
    //   // ...
    //   // and so on
    // }
  ],

  // stuff returned by our osparc job
  osparcResults: null,

  // if there's a current job we're polling, set this to that uuid string
  // initialize from browser localStorage, since this can be maintained across multiple sessions
  osparcJobID: null,

  // what we get back from es when we 
  // - kind of local cache so we don't have to call more than once
  // - keys are dataset DOI ids, values are the es record (inside the little wrapper we put with
  // some metadata). Though some records will not be found, so not have the es record
  datasetInfoEnrichedByES: {
  }
})

export const mutations = {
  ///////////////////////////
  // for datasets to compare with each other
  ///////////////////////////
  // if you have the full record
  add(state, dataset) {
    state.toCompare.push(dataset)
  },

  remove(state, dataset) {
    const matchIndex = state.toCompare.findIndex(ds => ds.id == dataset.id)

    state.toCompare.splice(matchIndex, 1)
  },

  ///////////////////////////
  // for handling osparc results
  ///////////////////////////

  // set what we get back from osparc (through the flask app)
  setOsparcJobID(state, osparcJobID) {
    // persist to local storage
    if (osparcJobID) {
      const today = new Date()
      const expirationDate = new Date(today.setDate(today.getDate() + 30))

      this.$cookies.set('datasetComparison.osparcJobID', osparcJobID, { expires: expirationDate })
    } else {
      this.$cookies.remove('datasetComparison.osparcJobID')
    }

    state.osparcJobID = osparcJobID
  },

  // set what we get back from osparc (through the flask app)
  setOsparcResults(state, osparcResults) {
    state.osparcResults = clone(osparcResults)
  },

  // set to empty object
  clearOsparcResults(state) {
    state.osparcResults = {}
  },
}
