import { DataTypes, Logging, Model } from 'sequelize';
import { createSequelize6Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['postgres']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  let options = {
    sequelize,
    modelName: 'Foo',
    schema: 'public',
    freezeTableName: true
  };


  await sequelize.define(
    'Foo',
    {
      name: {
        type: DataTypes.STRING,
        comment: 'Name of the user',
      }
    },
    options
  );

  await sequelize.sync({ force: true });

  let optionsSchema: Logging = {logging: false};

  try {
    sequelize.createSchema("test", optionsSchema);
  } catch { }

  options['schema'] = 'test';

  await sequelize.define(
    'Foo',
    {
      name: {
        type: DataTypes.STRING,
        comment: 'Name of the user',
      }
    },
    options
  );

  await sequelize.sync({ force: true });
  
  let result;
  try {
    result = await sequelize.getQueryInterface().describeTable('Foo');
  }
  catch (error) {
    console.log(error);
  }
  expect(result).to.not.equal(undefined);
}
