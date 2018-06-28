# oc-plugin-authenticate
oc-plugin-authenticate allows any OC component to authenticate requests.

## Authentication
An OC appication using this plugin may authenticate any request to help control application flow and protect sensitive data.

Usage:
```js
module.exports.data = (context, callback) => {
  context.plugins.authenticate(context, (err, {user, access_token}) => {
    if (err) {
      const errorMessage = 'unable to authenticate user';
      return callback(errorMessage);
    }

    callback(null, {
      access_token,
      username: user.username
    })
  });
};
```
After authenticating, you will receive either an error or a value using the callback pattern. The value will contain a `user` object, and a `token` string.

- The `user` object will contain any claims or details provided within your authentication token.

- The `token` string will be the authentication token provided in the original request and can be used to ensure further interactions with your OC component (eg. via AJAX calls using `getData`) are authenticated (see: [Persisting authentication](#Persisting-authentication)).

The authenticate method also has a few overloads which allows you to influence the authenticate algorithm if necessary.

```js
context.plugins.authenticate(context, strategy, callback);
context.plugins.authenticate(context, options, callback);
context.plugins.authenticate(context, strategy, options, callback);
```

`strategy` : `string` Allows you to specify what strategy to use when authenticating. The value must refer to one of the strategies provided when the plugin was registered within the oc-registry.

`options` : `object` Will override something or another UPDATE THIS PART PLEASE!

### Persisting authentication

When making `getData` calls within your component, sending headers is not possible by design as it causes the browser to make a [pre-flight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request). Therefore, you must provide the token as a simple oc parameter to ensure your application can authenticate your XHR request.

**We recommend that you reserve and use the `access_token` parameter to send the access_token because most `oc-authentication-strategy` implementations will expect this parameter by default.**

React Template example:
```js
  class MyComponent extends React.Component {
    constructor(props) {
      super(props);
    }

    doSomething(data) {
      const { access_token } = this.props;
      const params = {
        ...data,

        // we use access_token to ensure
        // that we can authenticate
        // our requests.
        access_token
      };

      this.props.getData(params, (err, data) => {
        this.setState({ data });
      });
    }

    render() {
      return <button onClick={() => this.doSomething({ name: 'bob' })}>GO!</button>
    }
  }
```

## Registry setup
For more information about integrating OC plugins [click here](https://github.com/opencomponents/oc/wiki/Registry#plugins).

When registering, the plugin must provide at least one `strategy` and must specify the `defaultStrategy`. Optionally, you may provide default `options` that will be provided to your strategy function.

```js
const configuration = { ... };
const registry = new oc.Registry(configuration);
const twitterAuth = require('some-twitter-oc-authentication-strategy');
const internalAuth = require('some-internal-oc-authentication-strategy');

registry.register(
  {
    name: 'authenticate',
    register: require('oc-authenticate'),
    options: {
      strategies: {
        twitter: {
          strategy: twitterAuth,
        }
        internal: {
          strategy: internalAuth
          options: { ... }
        }
      },
      defaultStrategy: 'twitter'
    }
  }
);

registry.start(callback);
```

## Authentication Strategies
[Creating an authentication strategy](docs/CREATING_STRATEGIES.md).