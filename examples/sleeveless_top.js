/*
This file makes a sleveless top (sweater-vest/summer-dress kind of shape)
*/
const {KnitoutUtil} = require("../lib/knitout_util");
let k = new KnitoutUtil();

const CARRIER = '6';

const WALES_WAIST       =72
const WALES_SHOULDER    =52
const WALES_NECK        =36

const COURSES_RIB       =30
const COURSES_BELLY     =30
const COURSES_ARMHOLE   =30
const COURSES_SHOULDER  =5
const COURSES_NECK      =30
//sleveless cone in
const X1WAIST = 0
const X2WAIST = WALES_WAIST
const X1SLEEVE =               (WALES_WAIST-WALES_SHOULDER)/2
const X2SLEEVE = WALES_WAIST-  (WALES_WAIST-WALES_SHOULDER)/2
const X1SLEEVECONE = KnitoutUtil.shape_round_to_gauge(KnitoutUtil.shape_line(COURSES_ARMHOLE,X1WAIST,X1SLEEVE,true),2)
const X2SLEEVECONE = KnitoutUtil.shape_round_to_gauge(KnitoutUtil.shape_line(COURSES_ARMHOLE,X2WAIST,X2SLEEVE,true),2)

k.run_autohook(k.wrap_serial(
	k.gen_bindon_tube_open(         k.STOCKINETTE,  CARRIER,                  X1WAIST,      X2WAIST),//bindon
	k.gen_arbtube(                  k.RIB1X1,       CARRIER, COURSES_RIB,     X1WAIST,      X2WAIST),//waist garter
	k.gen_arbtube(                  k.STOCKINETTE,  CARRIER, COURSES_BELLY,   X1WAIST,      X2WAIST),//belly
	k.gen_arbsquare_varying_sides(  k.STOCKINETTE,  CARRIER,                  X1SLEEVECONE, X2SLEEVECONE,0,'f'),//front side
),CARRIER)

//tie in from sleeve to neck
const X1NECK = X1SLEEVE + (WALES_SHOULDER-WALES_NECK)/2
const X2NECK = X2SLEEVE - (WALES_SHOULDER-WALES_NECK)/2
const X1NECKCONE = KnitoutUtil.shape_round_to_gauge(KnitoutUtil.shape_line(COURSES_SHOULDER,X1SLEEVE,X1NECK,true),2)
const X2NECKCONE = KnitoutUtil.shape_round_to_gauge(KnitoutUtil.shape_line(COURSES_SHOULDER,X2SLEEVE,X2NECK,true),2)

k.run_autohook(k.wrap_serial(
	k.gen_arbsquare_varying_sides(  k.STOCKINETTE,  CARRIER,               X1SLEEVECONE, X2SLEEVECONE,0,'b'),//back side
	k.gen_arbtube_varying_sides(    k.STOCKINETTE,  CARRIER,               X1NECKCONE  , X2NECKCONE),
	k.gen_arbtube(                  k.RIB1X1,       CARRIER, COURSES_NECK, X1NECK,       X2NECK),
	k.gen_bindoff_hg_opentube(                      CARRIER,               X1NECK,       X2NECK)
),CARRIER)

k.write('out/top.k');
