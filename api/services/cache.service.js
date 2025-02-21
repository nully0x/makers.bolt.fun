const { default: axios } = require("axios");
const env = require("../utils/consts");

function invalidateStoryById(id) {
  return makeRequest(
    `mutation { _purgeType(type: "Story", keyFields: [{name: "id", value: "${id}" }]) }`
  );
}

function invalidateUserById(id) {
  return makeRequest(
    `mutation { _purgeType(type: "User", keyFields: [{name: "id", value: "${id}" }]) }`
  );
}

function makeRequest(query) {
  if (!env.CACHE_PURGE_TOKEN) return null;
  return axios
    .post(
      "https://admin.stellate.co/boltfun",
      { query },
      {
        headers: {
          // and specify the Content-Type
          "Content-Type": "application/json",
          "stellate-token": env.CACHE_PURGE_TOKEN,
        },
      }
    )
    .catch((err) => {
      console.log("Error while invalidating cache with query: ", query);
      console.log(err);
    });
}

const cacheService = {
  invalidateStoryById,
  invalidateUserById,
};

module.exports = cacheService;
