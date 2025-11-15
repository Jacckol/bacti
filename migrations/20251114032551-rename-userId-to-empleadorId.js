'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.renameColumn(
      'perfiles_empleadores', // nombre de tu tabla
      'userId',               // columna actual
      'empleadorId'           // nuevo nombre
    );
  },

  async down(queryInterface) {
    return queryInterface.renameColumn(
      'perfiles_empleadores',
      'empleadorId',
      'userId'
    );
  },
};
