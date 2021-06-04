export default {
  Query: {
    fetchabcData: ({ params }) => {
      return { abc: params };
    },
  },

  Mutations: {},
};
