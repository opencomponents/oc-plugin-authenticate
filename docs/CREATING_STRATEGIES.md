# Creating an authentication strategy
Authentication strategies are responsible for finding and validating access tokens within the request. To facilitate this, your implementation will receive the request parameters, and the headers.

```js
const getToken = ({requestHeaders, params}) => {
  // retrieve the token...
  return token;
}

module.exports = (context, options, callback) => {
  const access_token = getToken(context);
  if (!access_token) {
    callback(new Error('No access token found'));
  }
  // validate token...
  // decode user information...
  callback(null, { user, access_token });
}
```

You must call the callback method with either an error, or an object which will typically provide a `user` and the original `access_token` found in the request. The strategy may be asynchronous allowing for calls to external services or apis for assistance.

Providing a `user` and `access_token` is a suggestion that if followed, will provide consistency for the consumers of `oc-plugin-authenticate`. If your strategy must diverge, there is nothing to prevent this.