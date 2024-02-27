# Knitout Util By Zaners123

Knitout Util creates knitout files for you, with the ability to make garments like:
 - [Sweaters](./sweater.js)
 - [Socks](./sock.js)
 - [Gloves](./glove.js)
 - [Patterns](./patterns.js) (Such as Rib, Garter, Seed, and Diagonal Stitch)

This assumes you have a machine capable of running compiled knitout, such as a Kniterate or a ShimaSeiki SSG.

## Example:

This is how you make a 50-course-long garter stitch tube from hooks 10-20 using carrier 5, without having to worry about inhooking, releasing the hook, or even what the pattern for garter stitch is:

```javascript
const lib = require('./lib');
let k = new lib.SmartWriter();
k.run(
	k.wrap_autohook(
		k.gen_arbtube(k.GARTER, 5, 50, 10, 20)
		, 5
	)
)
k.write('tube.k');
```

Run this code, then you can look at the output in [Knitout Visualizer](https://textiles-lab.github.io/knitout-live-visualizer/).