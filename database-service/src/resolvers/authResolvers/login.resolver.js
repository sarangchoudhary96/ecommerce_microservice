export default {
  Query: {
    fetchxyzData: ({ params }) => {
      return { abc: params.abc };
    },
  },

  Mutations: {},
};
