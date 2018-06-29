module.exports = function parseArgs(args) {
  const argHash = {
    context: args[0]
  };

  if (typeof args[1] === 'function') {
    argHash.callback = args[1];
  }

  if (typeof args[1] === 'string') {
    argHash.strategy = args[1];
    if (typeof args[2] === 'object') {
      argHash.options = args[2];
      argHash.callback = args[3];
    } else {
      argHash.callback = args[2];
    }
  }

  if (typeof args[1] === 'object') {
    argHash.options = args[1];
    argHash.callback = args[2];
  }

  return argHash;
}