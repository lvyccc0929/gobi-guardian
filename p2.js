// P2 - Gobi Guardian: Route Panorama + History Cards
// ---- Data ----

// 预加载所有城市图标
(function(){
var cities=["成都","广元","陇南","天水","兰州","张掖","哈密（目的地）"];
cities.forEach(function(c){
var img=new Image();img.src="assets/city-icons/"+c+".png";
});
})();
var WP=[["成都",104.0665,30.5728],["广元",105.823,32.435],["陇南",104.96,33.401],["天水",105.724,34.58],["兰州",103.834,36.061],["张掖",100.455,38.932],["哈密（目的地）",93.515,42.819]];
var NI={};
WP.forEach(function(w){NI[w[0]]=1});

var ER=[];
var ROUTE_RAW=[[104.066298,30.572795],[104.075276,30.582022],[104.075492,30.593565],[104.074676,30.620334],[104.072559,30.648616],[104.087435,30.672691],[104.094703,30.681788],[104.105495,30.697043],[104.118724,30.706682],[104.146593,30.72524],[104.15954,30.744469],[104.178988,30.781659],[104.207433,30.82795],[104.219267,30.87635],[104.2579,30.91385],[104.269217,30.928033],[104.294175,30.947889],[104.327157,30.986379],[104.365729,31.022098],[104.380094,31.069714],[104.407379,31.085252],[104.421864,31.144964],[104.429738,31.222073],[104.444313,31.267491],[104.464869,31.298722],[104.500871,31.323354],[104.531381,31.360479],[104.554601,31.387919],[104.583031,31.42134],[104.595862,31.448576],[104.612758,31.470123],[104.649496,31.50899],[104.68159,31.542716],[104.731152,31.566079],[104.750099,31.593503],[104.777354,31.634677],[104.799683,31.684422],[104.818602,31.719287],[104.857759,31.760223],[104.87472,31.791359],[104.907038,31.830895],[104.955219,31.860057],[104.991657,31.887102],[105.018703,31.900463],[105.055899,31.947748],[105.082205,31.982247],[105.112222,32.00657],[105.1285,32.035745],[105.160398,32.062937],[105.187016,32.082921],[105.209607,32.100452],[105.239451,32.127112],[105.256828,32.140584],[105.283314,32.15356],[105.330838,32.183717],[105.364185,32.207429],[105.393401,32.229456],[105.417031,32.240743],[105.450109,32.256794],[105.464676,32.268027],[105.478664,32.27892],[105.517676,32.277499],[105.53746,32.293006],[105.583223,32.322008],[105.612014,32.339757],[105.649264,32.35272],[105.700591,32.356641],[105.728407,32.370181],[105.743546,32.400123],[105.755302,32.415857],[105.76493,32.417315],[105.797524,32.413883],[105.811883,32.429148],[105.820862,32.434915],[105.81488,32.434196],[105.810937,32.423879],[105.791793,32.415958],[105.762745,32.416569],[105.743422,32.406637],[105.728576,32.391187],[105.713329,32.372876],[105.695694,32.371598],[105.681924,32.360158],[105.639711,32.35214],[105.60804,32.377498],[105.589115,32.384808],[105.557338,32.412552],[105.548214,32.428276],[105.526503,32.435124],[105.486468,32.502581],[105.468775,32.523591],[105.452694,32.541382],[105.409162,32.606515],[105.413874,32.647234],[105.434235,32.687457],[105.409603,32.764302],[105.410179,32.812742],[105.35697,32.834075],[105.319173,32.848615],[105.307594,32.914536],[105.292304,32.935667],[105.275599,32.954295],[105.244721,32.98147],[105.254715,33.040341],[105.261384,33.056922],[105.266184,33.073319],[105.27735,33.088988],[105.291736,33.116792],[105.306835,33.137069],[105.304726,33.158274],[105.307442,33.174337],[105.301708,33.192808],[105.275598,33.210448],[105.226911,33.286606],[105.216606,33.302323],[105.187321,33.318171],[105.135369,33.298013],[105.110761,33.282301],[105.098182,33.297598],[105.086116,33.316836],[105.065919,33.336634],[105.03315,33.342801],[104.999832,33.344989],[104.988057,33.356452],[104.972793,33.364755],[104.963956,33.376423],[104.963241,33.382713],[104.963701,33.38538],[104.961617,33.386207],[104.958867,33.387447],[104.962805,33.387244],[104.962478,33.388415],[104.963446,33.38917],[104.962102,33.391449],[104.958975,33.393969],[104.95471,33.394688],[104.956032,33.396419],[104.95773,33.39963],[104.957323,33.398844],[104.955515,33.395731],[104.955491,33.394757],[104.959586,33.392939],[104.962813,33.389772],[104.962698,33.389179],[104.96318,33.388249],[104.961888,33.388034],[104.959903,33.387564],[104.96266,33.385586],[104.963733,33.385156],[104.963308,33.38242],[104.958567,33.378114],[104.941941,33.377871],[104.939287,33.379071],[104.93044,33.386207],[104.921447,33.397969],[104.921747,33.412479],[104.90209,33.428708],[104.904893,33.438964],[104.917672,33.454215],[104.938443,33.456792],[104.959,33.462586],[104.967122,33.467253],[104.978528,33.465768],[105.011922,33.488065],[105.057195,33.505222],[105.082934,33.484081],[105.184948,33.442604],[105.216014,33.437915],[105.259598,33.434057],[105.295677,33.445797],[105.319418,33.440288],[105.345459,33.440217],[105.365693,33.457355],[105.364084,33.502637],[105.374858,33.524271],[105.393167,33.537804],[105.421404,33.556235],[105.44004,33.565045],[105.472323,33.644195],[105.489064,33.669937],[105.484789,33.698929],[105.479439,33.700417],[105.447339,33.719347],[105.419839,33.740113],[105.409768,33.761569],[105.395072,33.777035],[105.375768,33.797648],[105.370604,33.826704],[105.366162,33.848313],[105.348351,33.869008],[105.326902,33.885871],[105.326183,33.908006],[105.3206,33.931971],[105.296145,33.954145],[105.285601,33.972297],[105.287473,33.994064],[105.295653,34.034366],[105.307838,34.061493],[105.307163,34.096427],[105.319831,34.114637],[105.322519,34.14265],[105.335166,34.170311],[105.343711,34.210441],[105.388355,34.223679],[105.427278,34.241462],[105.452591,34.264381],[105.491476,34.281426],[105.516943,34.305064],[105.528692,34.322679],[105.542296,34.335684],[105.56324,34.350908],[105.591616,34.375622],[105.612314,34.394444],[105.623326,34.420509],[105.6331,34.447175],[105.651803,34.467797],[105.662225,34.490464],[105.673257,34.512045],[105.68924,34.528546],[105.694388,34.544123],[105.697736,34.576015],[105.703092,34.601479],[105.723875,34.628013],[105.742962,34.64793],[105.750261,34.668076],[105.745685,34.689473],[105.739348,34.706831],[105.728094,34.726019],[105.713651,34.751986],[105.698244,34.774545],[105.680332,34.799802],[105.662286,34.832611],[105.654201,34.856138],[105.642405,34.878425],[105.630204,34.894578],[105.610457,34.909282],[105.597676,34.927961],[105.570887,34.948719],[105.547744,34.972782],[105.530448,34.99346],[105.508117,35.023229],[105.497803,35.048313],[105.491792,35.071825],[105.48124,35.093019],[105.44637,35.108269],[105.409353,35.131872],[105.380029,35.159982],[105.362386,35.185774],[105.343078,35.214183],[105.324201,35.238241],[105.301487,35.253434],[105.278359,35.266679],[105.266578,35.30025],[105.21779,35.330119],[105.181854,35.35175],[105.161287,35.379758],[105.123464,35.408654],[105.078236,35.430108],[105.05618,35.447971],[105.040085,35.472781],[105.016272,35.497221],[104.982419,35.514322],[104.956589,35.533833],[104.930976,35.555211],[104.910829,35.584684],[104.882033,35.610587],[104.852295,35.644531],[104.83787,35.662487],[104.831683,35.677546],[104.815393,35.695293],[104.75581,35.762096],[104.73292,35.774357],[104.716331,35.789255],[104.697089,35.811171],[104.684976,35.828738],[104.670524,35.851399],[104.656641,35.873769],[104.641201,35.887855],[104.61692,35.899448],[104.586803,35.90782],[104.568797,35.915402],[104.546461,35.922426],[104.531795,35.936665],[104.496804,35.969755],[104.484673,35.993595],[104.460771,36.013688],[104.440692,36.033464],[104.420723,36.054822],[104.409123,36.07539],[104.397102,36.089034],[104.359243,36.102485],[104.333232,36.121234],[104.29958,36.149572],[104.274076,36.163941],[104.251781,36.173479],[104.237202,36.186341],[104.21839,36.206121],[104.183675,36.234801],[104.148896,36.257387],[104.123499,36.261733],[104.108948,36.282598],[104.080608,36.305462],[104.0345,36.335404],[103.999216,36.371685],[103.963495,36.402323],[103.923706,36.427719],[103.898321,36.453182],[103.877258,36.480469],[103.85158,36.498352],[103.83512,36.517178],[103.783674,36.588231],[103.767359,36.605466],[103.752284,36.624032],[103.720053,36.657895],[103.695687,36.680143],[103.675588,36.692443],[103.6412,36.721895],[103.600434,36.760273],[103.574952,36.78894],[103.548106,36.806818],[103.502333,36.827748],[103.447344,36.838399],[103.40717,36.858585],[103.387181,36.876731],[103.369057,36.897001],[103.358611,36.912283],[103.341852,36.932759],[103.315801,36.949762],[103.185064,37.012483],[103.140517,37.040328],[103.103509,37.065074],[103.078073,37.080489],[103.046612,37.100696],[102.998651,37.121683],[102.96202,37.137801],[102.932499,37.158352],[102.908033,37.178926],[102.877811,37.211019],[102.800748,37.290922],[102.744084,37.346453],[102.69833,37.383443],[102.654533,37.429329],[102.616145,37.482995],[102.58089,37.516496],[102.550661,37.543054],[102.513505,37.569048],[102.486122,37.591791],[102.44798,37.617931],[102.361081,37.659084],[102.300115,37.695533],[102.229608,37.7399],[102.167282,37.79096],[102.131436,37.835932],[102.110831,37.857461],[102.077094,37.879427],[102.032145,37.914207],[102.006802,37.948615],[101.980964,37.969257],[101.968176,37.985389],[101.952548,38.000873],[101.926928,38.011292],[101.876763,38.027679],[101.845112,38.047912],[101.813077,38.07568],[101.794698,38.100141],[101.777181,38.117634],[101.722221,38.164631],[101.698049,38.179076],[101.678391,38.198278],[101.651181,38.219869],[101.618865,38.251547],[101.59042,38.279853],[101.57107,38.301012],[101.507561,38.340983],[101.44426,38.375112],[101.357389,38.428982],[101.315559,38.452931],[101.284513,38.468017],[101.25659,38.479058],[101.231204,38.488691],[101.198255,38.505372],[101.170358,38.523899],[101.145935,38.545295],[101.122951,38.560603],[101.099098,38.57525],[101.074659,38.593266],[101.056114,38.610552],[101.029563,38.634073],[101.005771,38.648772],[100.988796,38.662573],[100.968053,38.678249],[100.928009,38.695328],[100.903431,38.714181],[100.872621,38.738013],[100.844695,38.757821],[100.822672,38.772209],[100.795815,38.787756],[100.770663,38.806694],[100.750186,38.827094],[100.727249,38.844221],[100.718433,38.856366],[100.701253,38.865157],[100.677858,38.873121],[100.65494,38.882638],[100.610793,38.913832],[100.56844,38.955824],[100.551815,38.975686],[100.544531,38.989748],[100.529884,39.001913],[100.495673,39.023724],[100.454845,39.057959],[100.430784,39.086075],[100.408092,39.109426],[100.377346,39.130775],[100.362856,39.148947],[100.338684,39.170871],[100.319156,39.197508],[100.304909,39.218307],[100.29147,39.234338],[100.280877,39.249922],[100.261051,39.270977],[100.253525,39.286338],[100.237035,39.306214],[100.218756,39.332638],[100.207181,39.354971],[100.196342,39.375195],[100.175635,39.39691],[100.149483,39.419304],[100.130882,39.437998],[100.111186,39.461234],[100.085885,39.480704],[100.064342,39.494413],[100.032309,39.506651],[100.01225,39.520222],[99.967428,39.536923],[99.931915,39.555412],[99.901965,39.575396],[99.867447,39.607453],[99.844573,39.627739],[99.805105,39.656756],[99.76705,39.682137],[99.739085,39.698106],[99.718585,39.719903],[99.678997,39.751973],[99.611324,39.81045],[99.542108,39.871793],[99.511902,39.899294],[99.487661,39.915309],[99.471246,39.930792],[99.428047,39.954125],[99.354226,39.984074],[99.277669,40.016417],[99.217477,40.041406],[99.223637,40.06978],[99.224086,40.132495],[99.227035,40.195275],[99.220054,40.237791],[99.197683,40.288356],[99.180983,40.33386],[99.167222,40.369325],[99.148527,40.398604],[99.119058,40.423493],[99.093574,40.454127],[99.068106,40.477808],[99.036538,40.496613],[99.002627,40.525305],[98.937484,40.575293],[98.898054,40.612037],[98.81588,40.674425],[98.79167,40.690586],[98.740072,40.710257],[98.641595,40.744386],[98.596621,40.758893],[98.549591,40.768488],[98.51946,40.779463],[98.472535,40.805822],[98.438006,40.825097],[98.399889,40.857782],[98.370691,40.895478],[98.351966,40.92486],[98.32382,40.958167],[98.307706,40.970303],[98.281672,40.980638],[98.262624,40.993502],[98.234017,41.015802],[98.171208,41.048083],[98.096123,41.092663],[97.982383,41.162921],[97.937382,41.191696],[97.898881,41.225443],[97.868362,41.246329],[97.819891,41.263402],[97.771939,41.278998],[97.748869,41.292431],[97.73064,41.310724],[97.717589,41.332988],[97.704336,41.357467],[97.686005,41.377251],[97.673158,41.401336],[97.663398,41.430322],[97.643618,41.457574],[97.61995,41.481675],[97.60002,41.504346],[97.590964,41.51724],[97.580442,41.525233],[97.56839,41.531484],[97.55725,41.540005],[97.536932,41.547468],[97.505825,41.548314],[97.479204,41.554739],[97.45686,41.565255],[97.440635,41.579576],[97.420235,41.597677],[97.405405,41.614486],[97.384458,41.627521],[97.343662,41.639168],[97.324457,41.650505],[97.290355,41.674884],[97.260072,41.698776],[97.214524,41.739738],[97.195279,41.753731],[97.187008,41.769943],[97.173762,41.784845],[97.153422,41.806231],[97.102091,41.843083],[97.075146,41.866966],[97.067269,41.888293],[97.053161,41.906999],[97.036287,41.92408],[97.01939,41.940683],[96.994587,41.957206],[96.963622,41.969268],[96.935555,41.980878],[96.910495,41.99399],[96.882185,42.00431],[96.854195,42.011622],[96.826793,42.021904],[96.810082,42.02879],[96.781104,42.037391],[96.762422,42.047418],[96.736475,42.060059],[96.704121,42.078436],[96.674875,42.101604],[96.646746,42.13429],[96.615467,42.160802],[96.540358,42.20219],[96.478544,42.243315],[96.437918,42.269196],[96.389663,42.293102],[96.321203,42.330948],[96.294395,42.355673],[96.261386,42.385538],[96.229495,42.418571],[96.149302,42.48607],[96.059425,42.561253],[96.015774,42.59815],[95.958518,42.630727],[95.884006,42.678265],[95.834682,42.714992],[95.811484,42.749248],[95.784746,42.780195],[95.760596,42.803195],[95.735169,42.815478],[95.719329,42.81465],[95.704978,42.808772],[95.641902,42.768316],[95.591909,42.737265],[95.541453,42.706338],[95.480359,42.663575],[95.405507,42.595405],[95.357078,42.568138],[95.320271,42.556701],[95.284384,42.560781],[95.261841,42.567967],[95.253422,42.582894],[95.254395,42.607181],[95.26409,42.632161],[95.258753,42.650712],[95.247964,42.661511],[95.217209,42.671115],[95.194565,42.67991],[95.17224,42.683483],[95.140739,41.757533],[95.132804,41.789278],[95.119244,41.811685],[95.073139,41.81383],[95.008248,41.809757],[94.956167,41.820168],[94.911806,41.838277],[94.861593,41.886765],[94.79463,41.914102],[94.70225,41.968056],[94.658719,41.991248],[94.512921,42.068437],[94.218186,42.296589],[94.156744,42.372927],[94.156437,42.486367],[94.175102,42.530671],[94.024796,42.664124],[93.762439,42.817692],[93.751109,42.819204],[93.598235,42.857772],[93.564235,42.861627],[93.528749,42.832363],[93.515396,42.819437]];
ER = ROUTE_RAW;

// ---- Elements ----
var C=document.getElementById("c"),X=C.getContext("2d");
var RF=document.getElementById("rf2"),CAR=document.getElementById("ci2");
var NP=document.getElementById("np"),QE=document.getElementById("q");
var DH=document.getElementById("dh");
var RC=document.getElementById("rc");
var DS=document.getElementById("ds");
var DC=document.getElementById("dc2"),DX=DC.getContext("2d");
var DL=document.getElementById("dl"),DLX=DL.getContext("2d");
var CT=document.getElementById("ct2"),CB=document.getElementById("cb");
var DTT=document.getElementById("dtt"),DTB=document.getElementById("dtb");
var DTC=document.getElementById("dtc"),DDN=document.getElementById("ddn");
var SH=document.getElementById("sh");
var HC=document.getElementById("hc"),HT2=document.getElementById("ht");
var IBS=document.getElementById("ibs");
var EHBTN=document.getElementById("enterHist");
EHBTN.onclick=function(e){e.stopPropagation();if(SE)EH();else alert("请等待文字出现完毕后再点击")};
var IV=document.getElementById("iv2"),IVI=document.getElementById("ivi");
var NAVL=document.getElementById("navL"),NAVR=document.getElementById("navR");

// ---- State ----
var P=0,TP=0,DRAG=false,ST="map",LNI=-1,DT=0,DS2=false,SE=false,HI=0,HTL=0;

// ---- Helpers ----
function W(){return window.innerWidth}
function H(){return window.innerHeight}
function R(){C.width=W();C.height=H();DC.width=W();DC.height=H();DL.width=W();DL.height=H()}
R();window.addEventListener("resize",R);window.addEventListener("orientationchange",function(){setTimeout(R,300)});

// ---- Slider ----
function updateSlider(clientX){
  var r=RC.getBoundingClientRect();
  var frac=(clientX-r.left)/r.width;
  frac=Math.max(0,Math.min(1,frac));
  TP=frac;
}
RC.addEventListener("pointerdown",function(e){DRAG=true;RC.setPointerCapture(e.pointerId);updateSlider(e.clientX);e.preventDefault()});
RC.addEventListener("pointermove",function(e){if(!DRAG)return;updateSlider(e.clientX)});
RC.addEventListener("pointerup",function(e){DRAG=false;RC.releasePointerCapture(e.pointerId)});
RC.addEventListener("pointercancel",function(e){DRAG=false;RC.releasePointerCapture(e.pointerId)});
RC.addEventListener("touchstart",function(e){e.preventDefault()},{passive:false});
RC.style.touchAction="none";

// ---- Panorama Image ----
var PANO=new Image();PANO.src="assets/p2-panorama.png";var PL=false;
PANO.onload=function(){PL=true};
PANO.onerror=function(){};

// ---- Draw Map ----
function DM(){
  var w=W(),h=H();
  X.clearRect(0,0,w,h);
  X.fillStyle="#c8b896";X.fillRect(0,0,w,h);
  if(PL&&PANO.naturalWidth>0){
    var pw=PANO.naturalWidth,ph=PANO.naturalHeight;
    var sc=h/ph;
    var fw=pw*sc;
    var maxSx=fw-w;if(maxSx<0)maxSx=0;
    var sx=P*maxSx;
    X.drawImage(PANO,sx/sc,0,w/sc,ph,0,0,w,h);
  }else{
    var g=X.createLinearGradient(0,0,0,h);
    g.addColorStop(0,"#ede3d5");g.addColorStop(0.5,"#e0d3bf");g.addColorStop(1,"#c4b590");
    X.fillStyle=g;X.fillRect(0,0,w,h);
  }
  // Route overlay
  X.save();
  var tw=w*2.2;
  var sx2=P*tw-w/2;
  X.translate(-sx2,0);
  var ry=h*0.6;
  // Route line
  X.beginPath();X.strokeStyle="rgba(255,215,0,0.55)";X.lineWidth=3.5;X.setLineDash([8,5]);X.lineDashOffset=-performance.now()*0.02;
  for(var i=0;i<ER.length;i++){
    var rx=(i/(ER.length-1))*tw;
    var y2=ry-Math.sin(i*0.04)*18;
    if(i===0)X.moveTo(rx,y2);else X.lineTo(rx,y2);
  }
  X.stroke();X.setLineDash([]);
  // City nodes with colors
  var cityColors={"成都":"#ffdd00","广元":"#ffcc00","陇南":"#ff9900","天水":"#e64400","兰州":"#881100","张掖":"#660000","哈密（目的地）":"#550088"};
  WP.forEach(function(w,i){
    var nx=(i/(WP.length-1))*tw,ny=ry-Math.sin(i*0.04)*18;
    X.beginPath();X.arc(nx,ny,7,0,Math.PI*2);X.fillStyle="#FFD700";X.fill();
    X.strokeStyle="#fff";X.lineWidth=2;X.stroke();
    X.font="bold 22px Noto Serif SC";X.textAlign="center";
    X.fillStyle=cityColors[w[0]]||"#fff";X.shadowColor="rgba(0,0,0,0.85)";X.shadowBlur=10;
    X.fillText(w[0],nx,ny-28);X.shadowBlur=0;
  });
  // Car
  var carX=P*tw,carY=ry-Math.sin(P*ER.length*0.04)*18;
  X.save();X.translate(carX,carY);
X.fillStyle="#2C2416";
X.beginPath();X.moveTo(14,0);X.lineTo(-8,-7);X.lineTo(-8,-3);X.lineTo(-14,-3);X.lineTo(-14,3);X.lineTo(-8,3);X.lineTo(-8,7);X.closePath();X.fill();
X.fillStyle="#FFD700";
X.beginPath();X.arc(-8,7,3,0,Math.PI*2);X.fill();
X.beginPath();X.arc(-8,-7,3,0,Math.PI*2);X.fill();
X.beginPath();X.arc(8,7,3,0,Math.PI*2);X.fill();
X.beginPath();X.arc(8,-7,3,0,Math.PI*2);X.fill();
X.restore();
  X.restore();
  // Vignette
  var vg=X.createRadialGradient(w/2,h/2,w*0.3,w/2,h/2,w*0.82);
  vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(40,20,10,0.12)");
  X.fillStyle=vg;X.fillRect(0,0,w,h);
}

// ---- City Popup ----
var CITY_ELMS=[];
function CN(){
  var ci=document.getElementById("city-icons");
  if(!CITY_ELMS.length&&ci){
    WP.forEach(function(w,i){
      var name=w[0];
      var el=document.createElement("div");
      el.style.cssText="position:absolute;width:70px;height:70px;border-radius:50%;overflow:hidden;border:3px solid #FFD700;box-shadow:0 0 30px rgba(255,215,0,.5);transform:translate(-50%,-50%);pointer-events:none";
      var img=document.createElement("img");
      img.src="assets/city-icons/"+name+".png";
      img.style.cssText="width:100%;height:100%;object-fit:cover";
      el.appendChild(img);
      ci.appendChild(el);
      CITY_ELMS.push({el:el, idx:i});
    });
  }
  var w=W(),h=H(),tw=w*2.2,ry=h*0.6,sx=P*tw-w/2;
  CITY_ELMS.forEach(function(ce){
    var nx=(ce.idx/(WP.length-1))*tw;
    var ny=ry-Math.sin(ce.idx*0.04)*18;
    ce.el.style.left=(nx-sx)+"px";
    ce.el.style.top=(ny-75)+"px";
  });
  NP.style.display="none";
}

// ---- Drone Scene ----
var DI=new Image();DI.src="assets/航拍图破损.png";var IL=false;
DI.onload=function(){IL=true};DI.onerror=function(){};
function DD(){
  var w=W(),h=H();DX.clearRect(0,0,w,h);
  var rt=Math.min(DT/2.5,1);
  if(IL){
    var ir=DI.width/DI.height,sr=w/h,sw,sh,sx,sy;
    if(ir>sr){sh=h;sw=h*ir;sx=-(sw-w)/2;sy=0}
    else{sw=w;sh=w/ir;sy=-(sh-h)/2;sx=0}
    DX.save();DX.translate(w/2,h/2);DX.scale(1+rt*.04,1+rt*.04);DX.translate(-w/2,-h/2);
    DX.drawImage(DI,sx,sy,sw,sh);DX.restore();
  }else{DX.fillStyle="#2C2416";DX.fillRect(0,0,w,h)}
  var vg=DX.createRadialGradient(w/2,h/2,w*.35,w/2,h/2,w*.8);
  vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.35)");
  DX.fillStyle=vg;DX.fillRect(0,0,w,h);
  DX.fillStyle="rgba(0,0,0,"+(.08+rt*.04)+")";DX.fillRect(0,0,w,h);
}
var DP=[];function ID2(){DP=[];for(var i=0;i<60;i++)DP.push({x:Math.random()*W(),y:Math.random()*H(),r:1+Math.random()*2.5,vx:-1-Math.random()*2,vy:-.3-Math.random()*.6,o:.3+Math.random()*.5})}
function DD2(){var w=W(),h=H();DLX.clearRect(0,0,w,h);for(var i=0;i<DP.length;i++){var dp=DP[i];dp.x+=dp.vx;dp.y+=dp.vy;if(dp.x<-10)dp.x=w+10;if(dp.y<-10)dp.y=h+10;if(dp.y>h+10)dp.y=-10;DLX.fillStyle="rgba(210,180,140,"+dp.o+")";DLX.beginPath();DLX.arc(dp.x,dp.y,dp.r,0,Math.PI*2);DLX.fill()}}

// ---- Scene Transitions ----
function SD(){IBS.onclick=function(){SD2()};
  // Show blackout screen
  ST="map";DS2=true;
  IBS.style.display="flex";
  document.getElementById("bz").style.opacity="0";
  QE.style.opacity="0";NP.style.opacity="0";DH.style.opacity="0";
  setTimeout(function(){IBS.querySelector(".t1").style.opacity="1"},400);
  setTimeout(function(){IBS.querySelector(".t2").style.opacity="1"},1000);
  setTimeout(function(){IBS.querySelector(".arr").style.opacity="1"},2000);
}

function SD2(){
  // Transition to drone scene
  IBS.style.display="none";
  ST="drone";DT=0;
  DS.style.display="block";DL.style.display="block";
  ID2();
  // Set text with suffixes
  DTT.innerHTML='标语的周围出现了多处圆形的人为破坏痕迹，<br>像一道道伤疤刻在"人民"中间。';
  DTB.innerHTML='这些字是谁写的？<br>为什么刻在无人区的戈壁上？<br><br><span style="font-size:13px;color:#FFD700">翻开历史卡片，看看58年前的故事</span>';
  DTC.innerHTML='';
  SH.innerHTML='';
  setTimeout(function(){CT.style.height="60px";CB.style.height="60px"},500);
  setTimeout(function(){DTT.style.opacity="1"},1200);
  setTimeout(function(){DTB.style.opacity="1"},2200);
  setTimeout(function(){DDN.style.background="rgba(0,0,0,.55)";DTC.style.opacity="1";setTimeout(function(){SH.style.opacity="1";SE=true;BC();EHBTN.style.display="block"},2200)},3800);
}

// IBS click → enter drone scene

// ---- History Cards ----
var HD=[
  {k:"card",ti:"1967年，第八航空学校建立",su:"在柳树泉组建，下设4个飞行团",de:"第八航空学校在柳树泉组建，下设4个飞行团。其中，二团驻扎在地标附近的骆驼圈子。茫茫戈壁，飞机导航设备落后，也没有地标指引，学员飞行训练很不方便。",im:"assets/history-01-air-school.jfif"},
  {k:"card",ti:"季臣业牵头设计地标",su:"为解决导航问题，战士们想出办法",de:"由领航主任季臣业带头，战士们事先在空中找到平坦戈壁，将标语写在纸上，到现场等比放大。然后用铁锹刮掉深色砾石露出浅色碱土——每字50米见方，面积3.7亩。",im:"assets/history-02-design.jpg"},
  {k:"card",ti:"8天苦战，5组30字",su:"行程500余里·5处地标位置",de:"教员与学员背上干粮带上工具，在4个空域下的黑色戈壁滩上，制成5组地标。上方为五处地标在戈壁中的分布位置。",im:"assets/五处地标的位置.jfif"},
  {k:"gal",ti:"五处地标",su:"每一处，都是刻进大地的信仰",de:"",ims:[{s:"assets/为人民服务.jfif",l:"为人民服务"},{s:"assets/向斗争中学习.jfif",l:"向斗争中学习"},{s:"assets/只争朝夕.jfif",l:"只争朝夕"},{s:"assets/排除万难去争取胜利.jfif",l:"排除万难去取得胜利"},{s:"assets/毛主席万岁.jfif",l:"毛主席万岁"}]},
  {k:"card",ti:"风沙吹不走，字不变形",su:"58年后，卫星地图仍清晰可见",de:"它们不是普通的字——是航标，是坐标，是那个年代刻进大地的信仰。抗住了60年风沙，却没能抗住某些人的破坏。",im:"assets/history-04-satellite.jfif"}
];

function BC(){
  HT2.innerHTML="";
  HD.forEach(function(d,i){
    var el=document.createElement("div");
    el.style.cssText="min-width:100vw;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40px 24px;overflow-y:auto";
    if(d.k==="gal"){
      var h='<div id="hct'+i+'" style="text-align:center;max-width:320px;opacity:0;transform:translateY(20px);transition:all .8s"><div style="font-family:Noto Serif SC,serif;font-size:22px;font-weight:700;color:#FFD700;margin-bottom:6px">'+d.ti+'</div><div style="font-size:15px;color:#C4A46C;margin-bottom:10px">'+d.su+'</div></div><div id="lg'+i+'" style="max-width:335px;opacity:0;transform:translateY(20px);transition:all .8s;margin:18px auto 0">';
      // Row 1: first 3 images
      h+='<div style="display:flex;gap:10px;justify-content:center;margin-bottom:10px">';
      for(var ri=0;ri<Math.min(3,d.ims.length);ri++){var im=d.ims[ri];h+='<div data-src="'+im.s+'" style="width:70px;height:70px;border-radius:14px;overflow:hidden;cursor:pointer;border:1px solid rgba(196,164,108,.4);box-shadow:0 0 20px rgba(196,164,108,0.1);flex-shrink:0"><img src="'+im.s+'" style="width:100%;height:100%;object-fit:cover"><div style="font-size:10px;color:#8B7355;text-align:center;margin-top:2px">'+im.l+'</div></div>'}
      h+='</div>';
      // Row 2: remaining images, centered
      if(d.ims.length>3){h+='<div style="display:flex;gap:10px;justify-content:center">';
      for(var ri=3;ri<d.ims.length;ri++){var im=d.ims[ri];h+='<div data-src="'+im.s+'" style="width:70px;height:70px;border-radius:14px;overflow:hidden;cursor:pointer;border:1px solid rgba(196,164,108,.4);box-shadow:0 0 20px rgba(196,164,108,0.1);flex-shrink:0"><img src="'+im.s+'" style="width:100%;height:100%;object-fit:cover"><div style="font-size:10px;color:#8B7355;text-align:center;margin-top:2px">'+im.l+'</div></div>'}
      h+='</div>'}
      h+='</div>';el.innerHTML=h;
    }else{
      el.innerHTML='<div id="hci'+i+'" data-src="'+(d.im||"")+'" style="width:280px;height:280px;border-radius:12px;overflow:hidden;margin-bottom:20px;box-shadow:0 0 40px rgba(196,164,108,0.15),0 4px 20px rgba(0,0,0,0.5);opacity:0;transform:translateY(30px);transition:all 1s">'+(d.im?'<img src="'+d.im+'" style="width:100%;height:100%;object-fit:cover">':'<div>图片 '+(i+1)+'</div>')+'</div><div id="hct'+i+'" style="text-align:center;max-width:320px;opacity:0;transform:translateY(20px);transition:all .8s"><div style="font-family:Noto Serif SC,serif;font-size:22px;font-weight:700;color:#FFD700;margin-bottom:6px">'+d.ti+'</div><div style="font-size:15px;color:#C4A46C;margin-bottom:10px">'+d.su+'</div><div style="font-size:13px;color:#8B7355;line-height:1.7">'+d.de+'</div></div>';
    }
    HT2.appendChild(el);
  });
  HTL=HD.length;
  setTimeout(function(){var els=HT2.querySelectorAll("[data-src]");for(var j=0;j<els.length;j++){els[j].addEventListener("click",function(ev){var s=this.getAttribute("data-src");if(s){ev.preventDefault();OIV(s)}})}},100);
}

// Enter history cards

var HCBG=null,HCBGX=null,HCP=[],HCBGA=null;
function HCBG_INIT(){
  HCBG=document.getElementById("hcBg");if(!HCBG)return;
  HCBG.width=window.innerWidth;HCBG.height=window.innerHeight;
  HCBGX=HCBG.getContext("2d");HCP=[];
  for(var i=0;i<60;i++)HCP.push({x:Math.random()*HCBG.width,y:Math.random()*HCBG.height,r:Math.random()*1.2+0.3,sp:Math.random()*0.4+0.15,op:Math.random()*0.5+0.15});
}
function HCBG_DRAW(){
  if(!HCBGX||HC.style.display==="none"){HCBGA=requestAnimationFrame(HCBG_DRAW);return}
  HCBGX.clearRect(0,0,HCBG.width,HCBG.height);
  for(var i=0;i<HCP.length;i++){
    var p=HCP[i];HCBGX.fillStyle="rgba(196,164,108,"+p.op+")";HCBGX.beginPath();HCBGX.arc(p.x,p.y,p.r,0,Math.PI*2);HCBGX.fill();
    p.y-=p.sp;if(p.y<-5){p.y=HCBG.height+5;p.x=Math.random()*HCBG.width}
  }
  HCBGA=requestAnimationFrame(HCBG_DRAW);
}
window.addEventListener("resize",function(){if(HCBG){HCBG.width=window.innerWidth;HCBG.height=window.innerHeight}});
HCBG_INIT();HCBGA=requestAnimationFrame(HCBG_DRAW);

function EH(){
  // Hide all drone scene elements
  DS.style.display="none";
  DDN.style.background="rgba(0,0,0,0)";
  CT.style.height="0";CB.style.height="0";
  DTT.style.opacity="0";DTB.style.opacity="0";DTC.style.opacity="0";SH.style.opacity="0";
  // Show history cards
  HC.style.display="block";
  NAVL.style.display="flex";NAVR.style.display="flex";EHBTN.style.display="none";
  HI=0;SC(0);
}

function SC(i){
  HT2.style.transform="translateX(-"+i+"00vw)";
  var d=HD[i];
  if(d.k==="gal"){
    setTimeout(function(){var e=document.getElementById("lg"+i);if(e){e.style.opacity="1";e.style.transform="translateY(0)"}},300);
    setTimeout(function(){var e=document.getElementById("hct"+i);if(e){e.style.opacity="1";e.style.transform="translateY(0)"}},600);
  }else{
    setTimeout(function(){var e=document.getElementById("hci"+i);if(e){e.style.opacity="1";e.style.transform="translateY(0)"}},300);
    setTimeout(function(){var e=document.getElementById("hct"+i);if(e){e.style.opacity="1";e.style.transform="translateY(0)"}},800);
  }
}

// Click on drone scene → enter history
document.body.addEventListener("click",function(e){
  if(!SE)return;
  if(HC.style.display!=="none")return;
  var t=e.target;
  if(t.closest("#rc")||t.closest("#bz"))return;
  EH();
});

// Navigate history cards
HC.addEventListener("click",function(e){
  if(HC.style.display==="none")return;
  // If clicked on an image with data-src, open viewer
  var srcEl=e.target.closest("[data-src]");
  if(srcEl){
    var s=srcEl.getAttribute("data-src");
    if(s){OIV(s);}
  }
});
var TX2=0;
HC.addEventListener("touchstart",function(e){TX2=e.touches[0].clientX});
HC.addEventListener("touchend",function(e){
  if(HC.style.display==="none")return;
  // Don't navigate if touch was on an image
  var srcEl=e.target.closest("[data-src]");
  if(srcEl)return;
  var d=e.changedTouches[0].clientX-TX2;
  if(d<-40&&HI<HTL-1){HI++;SC(HI)}
  else if(d>40&&HI>0){HI--;SC(HI)}
});

// Image viewer
IV.addEventListener("dblclick",function(){IV.style.display="none"});
IV.addEventListener("click",function(e){if(e.target===IV)IV.style.display="none"});
function OIV(src){if(!src)return;IVI.src=src;IV.style.display="flex"}

// ---- Main Loop ----
NAVL.addEventListener("click",function(e){e.stopPropagation();if(HI>0){HI--;SC(HI)}});
NAVR.addEventListener("click",function(e){e.stopPropagation();if(HI<HTL-1){HI++;SC(HI)}else{if(window.showOutro)window.showOutro()}});

function LOOP(){
  requestAnimationFrame(LOOP);
  P+=(TP-P)*.2;
  if(ST==="map"){
    var pct=P*100;
    RF.style.width=pct+"%";
    CAR.style.left=pct+"%";
    DM();CN();
    if(P>.005&&QE.style.opacity==="0")QE.style.opacity="1";
    if(P<.01)DH.style.opacity="1";
    else if(P>.12)DH.style.opacity="0";
    if(P>=.995&&!DS2)SD();
  }
  if(ST==="drone"){
    DT+=.016;DD();DD2();
  }
}

requestAnimationFrame(LOOP);
