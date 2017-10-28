1. Every `req` are the same instance. Then how is that `req.params` are different for different request?

2. What happens when there is uncaught error in middle ware?

3. After calling `res.send()`, does the rest part of middle ware run?

4. After calling `next()`, does the rest part of middle ware run?  

5. Do I have to call `next()` after `res.send()`? Will express be waiting for the `next()` to be called?
