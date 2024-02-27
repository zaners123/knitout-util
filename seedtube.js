// import the knitoutWriter code and instantiate it as an object
const knitout = require('./lib/knitout');
const lib = require('./lib/lib');

const COLOR_A = '6';
const COLOR_B = '7';
const COLOR_C = '8';

const RINGSIZE = 50;//40 to test, 80 to make
const WALES = 40;//12 to test, 40 to make

const CENTER = 51;
const X1=CENTER-WALES/2;
const X2=CENTER+WALES/2;

let course = 0;
let k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8','9','10']});

k.addHeader('Position','Right');
// bring in carrier using yarn inserting hook (end of yarn is held close)
k.inhook(COLOR_A);//Takes yarn out AND grabs its end

// course = lib.tuckon(k, course, COLOR_A, X1, X2);

// course = lib.tube(k, COLOR_A, course, course+2, X1, X2)
course = lib.seedtube(k, COLOR_A, course, course+2, X1, X2)
k.releasehook(COLOR_A)
course = lib.seedtube(k, COLOR_A, course, course+RINGSIZE-2, X1, X2)
k.outhook(COLOR_A); // Bring the yarn out with the yarn inserting hook. Cuts yarn

k.inhook(COLOR_B);//Takes yarn out AND grabs its end

// course = lib.tube(k, COLOR_B, course, course+2, X1, X2)
course = lib.seedtube(k, COLOR_B, course, course+2, X1, X2)
k.releasehook(COLOR_B)
course = lib.seedtube(k, COLOR_B, course, course+RINGSIZE-2, X1, X2)

k.outhook(COLOR_B);
k.inhook(COLOR_C);

course = lib.seedtube(k, COLOR_C, course, course+2, X1, X2)
k.releasehook(COLOR_C)
course = lib.seedtube(k, COLOR_C, course, course+RINGSIZE-2, X1, X2)

//Ending on a simple tube might make it stop giving a tuck off error?
course = lib.tube(k, COLOR_C, course, course+4, X1, X2)

lib.bindoffTubeClosed(k, COLOR_C, X1, X2);

k.outhook(COLOR_C);

k.write('seedtube.k');

return 0;
