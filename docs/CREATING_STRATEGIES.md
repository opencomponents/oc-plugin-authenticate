# Creating an authentication strategy
Authentication strategies are responsible for finding and validating access tokens within the request. To facilitate this, your implementation will receive the request parameters, and the headers.

```js
const getToken = ({requestHeaders, params}) => {
  // retrieve the token...
  return token;
}

module.exports = (context, options, callback) => {
  const accessToken = getToken(context);
  if (!accessToken) {
    callback(new Error('No access token found'));
  }
  // validate token...
  // decode user information...
  callback(null, { user, accessToken });
}
```

You must call the callback method with either an error, or an object providing a `user` and the original `accessToken` found in the request. The strategy may be asynchronous allowing for calls to external services or apis for assistance.