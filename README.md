# Knitout Util By Zaners123

A library to abstract away the complexities of manually typing out knitting patterns, racking, inhooking, and more.

## Example:

This is how you make a 50-course-long garter stitch tube from hooks 10-20 using carrier 5, without having to worry about inhooking, releasing the hook

```javascript
const lib = require('./lib');
let k = new lib.SmartWriter();
k.run(
    k.wrap_autohook(
    	k.gen_arbtube(k.GARTERTUBE,5,50, 10, 20)
        ,5
    )
)
k.write('tube.k');
```