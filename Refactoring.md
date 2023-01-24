# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
### Test coverage
There are 6 test cases covering possible situations based on provided method's logic before the refactoring:
 - When there is no event -> return '0' (test was already provided)
 - When there is no partition key in the event -> return hashed event body
 - When there is a string partition key in the event and its length is less than or eq 256 -> return key as is
 - When there is a non-string partition key in the event and its length after stringifying is less than or eq 256 -> return stringify-ed representation
 - When there is a partition key in the event (regardless if it's string or not) and its length is greater than 256 -> return hashed representation
I also added helper test method to calculate hash and I intentionally did not imported similar from implementation to decouple it from testing.

### Method refactoring
First of all, I moved constants out of the method: there is no reason to create new ones every time the method is get hit.

Then I noticed how verbose method is. It was fully overloaded with "if-else" statements.
So I decided to use the "Gatekeeper" principle: instead of checking variables for positive cases and then put "else"s for negative ones,
I check all the negative cases where some constants / independent values are possible to return.

After all I also added small `getHash()` function just to get rid of wide lines of hash calculating. Since they are used
at least twice - it make sense to wrap them and put aside. Also, it's quite handy when the hash algorithm needs to be changed:
you change it in a single place and that's it!

Also I was thinking about using ternary if operator, but it seems a bit messy in this particular case, so I decided to leave it as is.