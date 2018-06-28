const parseArgs = require('./parseArgs');
const state = {};
module.exports = {
  register(options, dependencies, next) {
    if (!options.defaultStrategy) {
      throw new Error('Please provide a defaultStrategy when registering oc-plugin-authenticate.');
    }
    if (!options.strategies || Object.keys(options.strategies).length < 1) {
      throw new Error('Please provide a strategies when registering oc-plugin-authenticate.');
    }

    state.options = options;
    next();
  },
  execute(...args) {
    const { defaultStrategy, strategies } = state.options;
    const { context, strategy = defaultStrategy, options, callback } = parseArgs(args);
    if (!strategies[strategy]) {
      return callback(new Error(`could not find authentication strategy: '${strategy}'`));
    }

    const strategyOpts = Object.assign({}, strategies[strategy].options, options);
    return strategies[strategy].strategy(context, strategyOpts, callback);
  }
};