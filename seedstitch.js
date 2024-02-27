// import the knitoutWriter code and instantiate it as an object
const knitout = require('./lib/knitout');
const lib = require('./lib/lib');

// swatch variables
let course = 0;

const CARRIER = '6';
const L1 = 80;
//first ring color
const C1 = 80;

const center = 50;
const X1=center-L1/2;
const X2=center+L1/2;

let k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8','9','10']});
k.addHeader('Position','Right');
// bring in carrier using yarn inserting hook (end of yarn is held close)
k.inhook(CARRIER);//Takes yarn out AND grabs its end

course = lib.tuckon(k, course, CARRIER, X1, X2);
course = lib.seedstitch(k, CARRIER, course, course+2, X1, X2);
k.releasehook(CARRIER); // lets go of end
course = lib.seedstitch(k, CARRIER, course, course+C1-2, X1, X2);
k.outhook(CARRIER); // Cuts yarn

k.write('seedstitch.k');

return 0;
