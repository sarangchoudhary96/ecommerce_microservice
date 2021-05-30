export default {
  Query: {
    fetchxyzData: async ({ sequelize }, { params, models }) => {
      const { UserModel } = models;
      return UserModel.findAll({ where: { id: params.id } });
    },
  },
  
  Mutations: {},
};
