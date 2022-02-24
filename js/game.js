

var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	wood:0x765c48,
	DarkPurple: 0x5D3FD3,
	lightPurple: 0xBF40BF,
	orchid: 0xDA70D6,
	mossGreen: 0x8A9A5B,
	oliveGreen: 0x808000,
	nightSky: 0x7b8993,
	nightSkyGradient:0x855988
};
var curPlane = 21;
const Planes = [
	
	{
		Name: "Plane of Fire",
        color1: "#D74009",
        color2: "#EE6B0B"
	},
    {
		Name: "Plane of Air",
		color1: "#33CCFF",
		color2: "#66D9FF"
    },
    {
		Name: "Plane of Water",
		color1: "#BBCDD9",
		color2: "#CBCDD9"
    },
    {
		Name: "Plane of Earth",
		color1: "#B98378",
		color2: "#C98378"
    },
    {
		Name: "Mechanus",
		color1: "#B9A167",
		color2: "#C9A167"
    },
    {
		Name: "Arcadia",
		color1: "#9DB569",
		color2: "#AdB569"
	},
    {
		Name: "Mount Celestia",
		color1: "#DBDBDB",
		color2: "#EBDBDB"
    },
    {
		Name: "Bytopia",
		color1: "#D4AF37",
		color2: "#aaa9ad"
    },
    {
		Name: "Elysium",
		color1: "#E8B319.",
		color2: "#E43414"
    },
    {
		Name: "Beastlands",
		color1: "#D9D7C7",
		color2: "#E9D7C7"
    },
    {
		Name: "Arborea",
		color1: "#957641",
		color2: "#A57641"
	},
    {
		Name: "Ysgard",
		color1: "#CEEAEE",
		color2: "#DEEAEE"
    },
    {
		Name: "Limbo",
		color1: "#565656",
		color2: "#c0c0c0" 
    },
    {
		Name: "Pandemonium",
		color1: "#b5651e",
		color2: "#39FF14"
    },
    {
		Name: "Abyss",
		color1: "#3d492b",
		color2: "#47193b"
    },
    {
		Name: "Carceri",
		color1: "#C9C1B5.",
		color2: "#D9C1B5."
	},
    {
		Name: "Hades",
		color1: "#7D8A96",
		color2: "#*D8A96"
    },
    {
		Name: "Gehenna",
		color1: "#E2E5DE",
		color2: "#F2E5DE"
    },
    {
		Name: "Nine Hells",
		color1: "#E71E02",
		color2: "#000000"
    },
    {
		Name: "Acheron",
		color1: "#2A4C7E",
		color2: "#888C8D"
	},
	{
		Name: "Home",
		color1: "#e4e0ba",
		color2: "#f7d9aa"
	},
	
    

];

const ArgoNavis = [
	430, -712, 
	487, -759,
	424, -777,
	361, -734,
	377, -687,
	456, -634,
	528, -636,
	571, -557,
	569, -403,
	571, -214,
	622, -225,
	650, -252,
	685, -385,
	749, -482,
	697, -552,
	673, -475,
	640, -450,
	571, -403,
	640, -450,
	673, -475,
	697, -552,
	732, -595,
	487, -759

];
const VelaNavis = [
	432, -453,
	481, -436,
	495, -461,
	550, -491,
	490, -580,
	432, -589,
	373, -591, 
	264, -585,
	275, -563,
	287, -477,
	374, -427,
	432, -452
]

var storedNames = JSON.parse(localStorage.getItem("names"));

var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;
		
function createScene()
{
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;


    scene = new THREE.Scene();


	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
	
	// Create the camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);
	
	// Set the position of the camera
    camera.position.x = 0;
	camera.position.z = 200;
    camera.position.y = 100;
    // Create the renderer
	renderer = new THREE.WebGLRenderer({ 
		// Allow transparency to show the gradient background
		// we defined in the CSS
		alpha: true, 

		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine :)
		antialias: true 
	});

	// Define the size of the renderer; in this case,
	// it will fill the entire screen
	renderer.setSize(WIDTH, HEIGHT);
	
	// Enable shadow rendering
	renderer.shadowMap.enabled = true;
	
	// Add the DOM element of the renderer to the 
	// container we created in the HTML
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);
	

	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);

}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}
var hemisphereLight, shadowLight;

function createLights() {
	// A hemisphere light is a gradient colored light; 
	// the first parameter is the sky color, the second parameter is the ground color, 
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	// Set the direction of the light  
	shadowLight.position.set(150, 350, 350);
	
	// Allow shadow casting 
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1400;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performance
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// an ambient light modifies the global color of a scene and makes the shadows softer
	ambientLight = new THREE.AmbientLight(0xdc8874, .5);//original from example
	scene.add(ambientLight);

	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
}

var SunCycleCount=0;
const BackgroundLightDay = new THREE.Color(0xdc8874);
const BackgroundLightNight = new THREE.Color(Colors.nightSky);
function UpdateSunCycle()  {
	shadowLight.position.set(150*Math.cos(SunCycleCount),350*Math.cos(SunCycleCount),315);
	shadowLight.intensity =(0.6 + .3*Math.sin(3.14*shadowLight.position.y/350));
	hemisphereLight.intensity = (0.6 + .3*Math.sin(3.14*shadowLight.position.y/350));
	//Ambient Light: change color to a more purple hue and reduce intensity as y position goes to 0, then stay low until
	//y position is no longer negative 
	ambientLight.intensity = (0.3 + .2*Math.sin(3.14*shadowLight.position.y/350));
	ambientLight.color.lerpColors(BackgroundLightNight, BackgroundLightNight, 0.5-0.5*Math.sin(-3.14*shadowLight.position.y/350));
	SunCycleCount+=0.002;



	if(SunCycleCount >= 62.8318530718)//resetting because I was originally an C and assembly programmer and paranoid about overflow
	{
		SunCycleCount = 0;
	}
	var setGradientTop 		= 	lerpColor('#565d8d',Planes[curPlane-1].color1, 0.5-0.5*Math.sin(-3.14*shadowLight.position.y/350));//changes colors to a different one at nighttime
	var setGradientBottom 	= 	lerpColor('#777ba3',Planes[curPlane-1].color2, 0.5-0.5*Math.sin(-3.14*shadowLight.position.y/350));
	document.getElementById("gameholder").style.background = 'linear-gradient(' + setGradientTop + ',' + setGradientBottom+')';

	function lerpColor(a, b, amount) 
	{ 
    	var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);
    	return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
	}

}


var MAX_POINTS_ARGO = ArgoNavis.length/2;
var MAX_POINTS_VELA = VelaNavis.length/2;
Constellation = function(){
   this.mesh = new THREE.Object3D();
   var geometryArgo = new THREE.BufferGeometry();
   var geometryVela = new THREE.BufferGeometry();
   var positionsArgo = new Float32Array( MAX_POINTS_ARGO * 3 ); // 3 vertices per point
   var positionsVela = new Float32Array( MAX_POINTS_VELA * 3 ); // 3 vertices per point
   geometryArgo.setAttribute( 'position', new THREE.BufferAttribute( positionsArgo, 3 ) );
   geometryVela.setAttribute( 'position', new THREE.BufferAttribute( positionsVela, 3 ) );
   var index = 0;
   var indexA = 0;
   for(var i = 0; i < MAX_POINTS_ARGO; i++) 
   {
	positionsArgo[ index ++ ] = ArgoNavis[indexA++]-500;
	positionsArgo[ index ++ ] = ArgoNavis[indexA++]+400;
	positionsArgo[ index ++ ] = 0;	//z is on coordinate 0 always
   }
   index = 0;
   indexA = 0;
   for(var i = 0; i < MAX_POINTS_VELA; i++) 
   {
	positionsVela[ index ++ ] = VelaNavis[indexA++]-500;
	positionsVela[ index ++ ] = VelaNavis[indexA++]+400;
	positionsVela[ index ++ ] = 0;	//z is on coordinate 0 always
   }
   // material
   var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF, linewidth: 2 } );
   geometryArgo.setDrawRange( 0, MAX_POINTS_ARGO );
   // line
   lineArgo = new THREE.Line( geometryArgo,  material );
   var drawCount = 1;
   lineVela = new THREE.Line( geometryVela,  material );
   //console.log(geometryArgo);
   //console.log(geometryVela);
   this.mesh.add(lineArgo);
   this.mesh.add(lineVela);

   this.mesh.Stars = [];
   var starGeom = new THREE.BoxGeometry(2,2,2);
   // create a material; a simple white material will do the trick
   var starMat = new THREE.MeshBasicMaterial({
   	color:0xD5AB55, opacity: 0, transparent: true
   });
   indexA = 0;
   count = 0;
   for(var i = 0; i < MAX_POINTS_ARGO; i++)
   {
		var s = new THREE.Mesh(starGeom, starMat);
		s.position.x = positionsArgo[indexA++];
		s.position.y = positionsArgo[indexA++];
		s.position.z = positionsArgo[indexA++];
		this.mesh.Stars[i] = s;
		this.mesh.add(s);
		count++;
   }
   indexA = 0;
   for(var i = 0; i < MAX_POINTS_VELA; i++)
   {
		var s = new THREE.Mesh(starGeom, starMat);
		s.position.x = VelaNavis[indexA++]-500;
		s.position.y = VelaNavis[indexA++]+400;
		s.position.z = 0;
		this.mesh.Stars[i+MAX_POINTS_ARGO] = s;
		//console.log(this.mesh.Stars);
		this.mesh.add(s);
		count++
   }
   //console.log(MAX_POINTS_ARGO,MAX_POINTS_VELA);
   //console.log("COUNT IS : ", count);
}
var constellation;
function createConstellation(){
	constellation = new Constellation();
	constellation.mesh.position.x = 910;
	constellation.mesh.position.y = 630;
	constellation.mesh.position.z = -1000;
	//console.log(constellation.mesh);
	var constellationScale = 0.7;
	constellation.mesh.scale.set(constellationScale,constellationScale ,constellationScale);
	//console.log(constellation.mesh.children[0].geometry)
	constellation.mesh.children[0].geometry.setDrawRange(0,0);
	constellation.mesh.children[1].geometry.setDrawRange(0,0);
	scene.add(constellation.mesh);
	

}


inStarAnimation = false;
var Starindex = 0;
var StarDrawRange = 0;
var finishedFadeIn = false;
var lingerTimer = 0;
var StarDrawRangeBegin = 0;
Constellation.prototype.FadeInStars = function() {
	//ensures that this only happens during the nighttime, aka when the count is on a cycle of pi but not 2pi
	if((Math.cos(SunCycleCount).toFixed(1) == -1 && SunCycleCount>0))
	{
		inStarAnimation = true;
	}
	if(inStarAnimation)
	{
		var stars = this.mesh.Stars;
		//console.log(Starindex);
		if(!finishedFadeIn)
		{
			if(Starindex<stars.length){
				stars[Starindex].material.transparent = false;
				stars[Starindex].material.opacity+=0.015;
				stars[Starindex].material.needsUpdate = true;
				//console.log(stars[Starindex]);
	
				if(stars[Starindex].material.opacity>=1)
				{
					Starindex++;
				}
			}
			//a sign that all the stars have rendered
			else if(Starindex>=stars.length && StarDrawRange < MAX_POINTS_ARGO+1){
				StarDrawRange+=0.15;
				this.mesh.children[0].geometry.setDrawRange(StarDrawRangeBegin, Math.floor(StarDrawRange));
				this.mesh.children[0].geometry.needsUpdate = true;
				
			}	//setting draw range for velanavis
			else if (Starindex>=stars.length && StarDrawRange > MAX_POINTS_ARGO && StarDrawRange < MAX_POINTS_ARGO+MAX_POINTS_VELA+1){
				StarDrawRange+=0.15;
				this.mesh.children[1].geometry.setDrawRange(StarDrawRangeBegin, Math.floor(StarDrawRange) - MAX_POINTS_ARGO);
				this.mesh.children[1].geometry.needsUpdate = true;
				
			}
			else if(StarDrawRange >= MAX_POINTS_ARGO + MAX_POINTS_VELA){
				finishedFadeIn = true;
				lingerTimer = 0;
				console.log("Benchmakr1");
			}	
		}
		//console.log("Yp",lingerTimer);
		//console.log(inStarAnimation);
		if(finishedFadeIn)
		{
			//this if statement makes it so that whatever is inside is only run once.
			//console.log("Whatup");
			if(lingerTimer > 400)
			{
				//console.log("Ye");
				for(var i = 0; i < stars.length;i++)
				{
					stars[i].material.opacity-=0.0002;
					stars[i].material.needsUpdate = true; 
					if(StarDrawRangeBegin < MAX_POINTS_ARGO)
					{
						
						this.mesh.children[0].geometry.setDrawRange(Math.floor(StarDrawRangeBegin), MAX_POINTS_ARGO-StarDrawRangeBegin);
						this.mesh.children[0].geometry.needsUpdate = true;
						StarDrawRangeBegin += 0.008;
						
					}
					else if (StarDrawRangeBegin >= MAX_POINTS_ARGO && StarDrawRangeBegin < (MAX_POINTS_ARGO+MAX_POINTS_VELA+1))
					{
						console.log(Math.floor(StarDrawRangeBegin-MAX_POINTS_ARGO));
						this.mesh.children[1].geometry.setDrawRange(Math.floor(StarDrawRangeBegin-MAX_POINTS_ARGO), MAX_POINTS_ARGO+MAX_POINTS_VELA-StarDrawRangeBegin);
						this.mesh.children[1].geometry.needsUpdate = true;
						StarDrawRangeBegin += 0.008;
					}
				}
				
				if(stars[0].material.opacity <= 0)
				{
					console.log("Done")
					//console.log(StarDrawRangeBegin, MAX_POINTS_ARGO,StarDrawRangeBegin>= MAX_POINTS_ARGO, StarDrawRangeBegin<( (MAX_POINTS_ARGO+MAX_POINTS_VELA+1)));
					inStarAnimation = false;//flag to trip the fade out animation is done
					lingerTimer=0;
					Starindex = 0;
					StarDrawRange = 0;
					StarDrawRangeBegin = 0;
					finishedFadeIn = false;
				}
			}
			else{
				
				lingerTimer++;
			}
			
			
		}
	}
}



Sea = function(){
	var geom = new THREE.CylinderBufferGeometry(600,600,800,40,10);
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

	// important: by merging vertices we ensure the continuity of the waves
	//geom.mergeVertices();

	//console.log(geom);

	// get the vertices
	var l = geom.attributes.position.array.length;

	// create an array to store new data associated to each vertex
	this.waves = [];
	var i = 0 ;
	while( i < l){
		// get each vertex
		//var v = geom.vertices[i];

		this.waves.push({
			x:geom.attributes.position.array[i++],
			y:geom.attributes.position.array[i++],
			z:geom.attributes.position.array[i++],
			//random angle to send the wave
			ang: Math.random()*Math.PI*2,
			//random distance to send it
			amp:5 + Math.random()*15,
			//random speed to move the wave every frame between .016 and .048 rad/frame
			speed: 0.016 + Math.random() * 0.032
		});
	};
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.blue,
		transparent:true,
		opacity:.8
		//shading:THREE.FlatShading,
	});
	mat.flatShading = true;

	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;

}

// now we create the function that will be called in each frame 
// to update the position of the vertices to simulate the waves
var extraSpeed = 0;
Sea.prototype.moveWaves = function (){
	
	// get the vertices
	var verts = this.mesh.geometry.attributes.position.array;
	var l = this.waves.length;
	var i = 0;
	while(i<l){

		// get the data associated to it
		var vprops = this.waves[i];
		// update the position of the vertex
		//verts[i++] = vprops.x + Math.cos(vprops.ang)*vprops.amp;
		//verts[i++] = vprops.y + Math.sin(vprops.ang)*vprops.amp;
		//console.log(this.mesh.geometry.attributes.position.array[0]);
		this.mesh.geometry.attributes.position.array[i++] = vprops.x + Math.cos(vprops.ang)*vprops.amp;
		this.mesh.geometry.attributes.position.array[i++] = vprops.y + Math.sin(vprops.ang)*vprops.amp;
		i++;											//the 'z' component that we're skipping

		// increment the angle for the next frame
		vprops.ang += vprops.speed;

	}

	// Tell the renderer that the geometry of the sea has changed.
	// In fact, in order to maintain the best level of performance, 
	// three.js caches the geometries and ignores any changes
	// unless we add this line
	//console.log(this.mesh.geometry.verticesNeedUpdate);
	this.mesh.geometry.attributes.position.needsUpdate=true;


	if(idle)
	{
		extraSpeed = normalize(mousePosNormed.x,-.5,.5,-0.001, 0.0024);
		sea.mesh.rotation.z += .003 + extraSpeed;
	}
	else
	{
		extraSpeed = normalize(mousePosNormed.x,-.5,.5,-0.001, 0.0024);
		sea.mesh.rotation.z += .005+extraSpeed;	
	}
	
}

// Instantiate the sea and add it to the scene:
var sea;
function createSea(){
	sea = new Sea();

	// push it a little bit at the bottom of the scene
	sea.mesh.position.y = -600;

	// add the mesh of the sea to the scene
	scene.add(sea.mesh);
}

Cloud = function(){
	// Create an empty container that will hold the different parts of the cloud
	this.mesh = new THREE.Object3D();
	
	// create a cube geometry;
	// this shape will be duplicated to create the cloud
	var geom = new THREE.BoxGeometry(20,20,20);
	
	// create a material; a simple white material will do the trick
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,  
	});
	
	// duplicate the geometry a random number of times
	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){
		
		// create the mesh by cloning the geometry
		var m = new THREE.Mesh(geom, mat); 
		
		// set the position and the rotation of each cube randomly
		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		
		// set the size of the cube randomly
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);
		
		// allow each cube to cast and to receive shadows
		m.castShadow = true;
		m.receiveShadow = true;
		
		// add the cube to the container we first created
		this.mesh.add(m);
	} 
}

// Define a Sky Object
Sky = function(){
	// Create an empty container
	this.mesh = new THREE.Object3D();
	
	// choose a number of clouds to be scattered in the sky
	this.nClouds = 20;
	
	// To distribute the clouds consistently,
	// we need to place them according to a uniform angle
	var stepAngle = Math.PI*2 / this.nClouds;
	
	// create the clouds
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();
	 
		// set the rotation and the position of each cloud;
		// for that we use a bit of trigonometry
		var a = stepAngle*i; // this is the final angle of the cloud
		var h = 750 + Math.random()*200; // this is the distance between the center of the axis and the cloud itself

		// Trigonometry!!! I hope you remember what you've learned in Math :)
		// in case you don't: 
		// we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;

		// rotate the cloud according to its position
		c.mesh.rotation.z = a + Math.PI/2;

		// for a better result, we position the clouds 
		// at random depths inside of the scene
		c.mesh.position.z = -400-Math.random()*400;
		
		// we also set a random scale for each cloud
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		// do not forget to add the mesh of each cloud in the scene
		this.mesh.add(c.mesh);  
	}  
}

// Now we instantiate the sky and push its center a bit
// towards the bottom of the screen

var sky;

function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

var AirPlane = function() {
	
	this.mesh = new THREE.Object3D();
	const geomHull = new THREE.Shape();
    geomHull.moveTo( 35,-25);
    geomHull.lineTo(-60,-25);  
	geomHull.moveTo(-60,-25);
	geomHull.lineTo(-60,-15);	
	geomHull.moveTo(-60,-15);
	geomHull.lineTo(-75,-15);	
	geomHull.moveTo(-75,-15);
	geomHull.lineTo(-75, 5);	
	geomHull.moveTo(-75, 5);
	geomHull.lineTo(-90, 5);	
	geomHull.moveTo(-90, 5);
	geomHull.lineTo(-90, 55);	
	geomHull.moveTo(-90, 55);
	geomHull.lineTo(-75, 55);
	geomHull.moveTo(-75, 55);
	geomHull.lineTo(-75, 45);
	geomHull.lineTo(-75, 45);
    geomHull.lineTo(-60, 45) ;
    geomHull.moveTo(-60, 45);
    geomHull.lineTo(-60, 30) ;
    geomHull.moveTo(-60, 30);
    geomHull.lineTo(-30, 30) ;   
	geomHull.moveTo(-30, 30);
	geomHull.lineTo( 35, 30);
	geomHull.moveTo( 35, 30);
    geomHull.lineTo( 35, 40);    
	geomHull.moveTo( 35, 40);
	geomHull.lineTo( 35,-25);
	const hullWidth = 50
	const extrudeSettingsHull = { depth: hullWidth, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
	const geometryHull = new THREE.ExtrudeGeometry( geomHull, extrudeSettingsHull );
	//console.log(geometryHull);
	var matHull = new THREE.MeshLambertMaterial({color:Colors.wood, shading:THREE.FlatShading});
	var hull = new THREE.Mesh(geometryHull, matHull);
	hull.castShadow = true;
	hull.receiveShadow = true;
	hull.translateZ(-(hullWidth/2));
	//console.log(hull);
	this.mesh.add(hull);

	const geomBow1 = new THREE.Shape();
	geomBow1.moveTo( 35, 40);
	geomBow1.lineTo( 60, 40);	
	geomBow1.moveTo( 60, 45);
	geomBow1.lineTo( 60,-20);	
	geomBow1.moveTo( 60,-20);
	geomBow1.lineTo( 35,-20);	
	geomBow1.moveTo( 35,-20);
	geomBow1.lineTo( 35, 40);	
	geomBow1.moveTo( 35, 40);
	const bow1Width = hullWidth*0.9;
	const extrudeSettingsBow1 = { depth: bow1Width, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
	const geometryBow1 = new THREE.ExtrudeGeometry(geomBow1, extrudeSettingsBow1);
	var bow1 = new THREE.Mesh(geometryBow1, matHull);
	bow1.castShadow = true;
	bow1.receiveShadow = true;
	bow1.translateZ(-(hullWidth/2));
	this.mesh.add(bow1);

	const geomBow2 = new THREE.Shape();
	geomBow2.moveTo( 60, 45);
	geomBow2.lineTo( 75, 45);	
	geomBow2.moveTo( 75, 45);
	geomBow2.lineTo( 75,-10);	
	geomBow2.moveTo( 75,-10);
	geomBow2.lineTo( 60,-10);	
	geomBow2.moveTo( 60,-10);
	geomBow2.lineTo( 60, 45);	
	geomBow2.moveTo( 60, 45);
	const bow2Width = hullWidth*0.75;
	const extrudeSettingsBow2 = { depth: bow2Width, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
	const geometryBow2 = new THREE.ExtrudeGeometry(geomBow2, extrudeSettingsBow2);
	var bow2 = new THREE.Mesh(geometryBow2, matHull);
	bow2.castShadow = true;
	bow2.receiveShadow = true;
	bow2.translateZ(-(hullWidth/2));
	this.mesh.add(bow2);

	const geomBow3 = new THREE.Shape();
    geomBow3.moveTo( 75, 50);
    geomBow3.lineTo( 90, 50);   
    geomBow3.moveTo( 90, 50);
    geomBow3.lineTo( 90, 5);   
    geomBow3.moveTo( 90, 5);
    geomBow3.lineTo( 75, 5);   
    geomBow3.moveTo( 75, 5);
    geomBow3.lineTo( 75, 50);   
    geomBow3.moveTo( 75, 50);
    const bow3Width = hullWidth*0.5;
    const extrudeSettingsBow3 = { depth: bow3Width, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const geometryBow3 = new THREE.ExtrudeGeometry(geomBow3, extrudeSettingsBow3);
    var bow3 = new THREE.Mesh(geometryBow3, matHull);
    bow3.castShadow = true;
    bow3.receiveShadow = true;
    bow3.translateZ(-(hullWidth/2));
    this.mesh.add(bow3);

	const geomBow4 = new THREE.Shape();
    geomBow4.moveTo( 90, 52);
    geomBow4.lineTo( 105, 52);   
    geomBow4.moveTo( 105, 52);
    geomBow4.lineTo( 105, 15);   
    geomBow4.moveTo( 105, 15);
    geomBow4.lineTo(  90, 15);   
    geomBow4.moveTo(  90, 15);
    geomBow4.lineTo( 90, 52);   
    geomBow4.moveTo( 90, 52);
    const bow4Width = hullWidth*0.25;
    const extrudeSettingsBow4 = { depth: bow4Width, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const geometryBow4 = new THREE.ExtrudeGeometry(geomBow4, extrudeSettingsBow4);
    var bow4 = new THREE.Mesh(geometryBow4, matHull);
    bow4.castShadow = true;
    bow4.receiveShadow = true;
    bow4.translateZ(-(hullWidth/2));
	this.mesh.add(bow4);


	//complete: Cabin box
	const geomCabin = new THREE.Shape();
	geomCabin.moveTo(30,30);
	geomCabin.lineTo(30,50);
	geomCabin.moveTo(30,50);
	geomCabin.lineTo(-20,50);
	geomCabin.moveTo(-20,50);
	geomCabin.lineTo(-20,30);
	geomCabin.moveTo(-20,30);
	geomCabin.lineTo(30,30);
	geomCabin.moveTo(30,30);
	const cabinWidth = 30
	const extrudeSettingsCabin = { depth: cabinWidth, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
	const geometryCabin = new THREE.ExtrudeGeometry(geomCabin,extrudeSettingsCabin);
	//var matCabin = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FLatShading});
	var cabin = new THREE.Mesh(geometryCabin, matHull);
	cabin.castShadow = true;
	cabin.receiveShadow = true;
	cabin.translateZ(-cabinWidth/2);
	this.mesh.add(cabin);
	

	// complete: mushroom
	
	const radiusTop = 12;
	const radiusBottom = 14;
	const mushHeight = 50;
	const radSegments = 6;
	const geomMushStem = new THREE.CylinderGeometry(radiusTop, radiusBottom, mushHeight, radSegments);
	const matMushStem = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
	var mushStem = new THREE.Mesh(geomMushStem, matMushStem);
	mushStem.castShadow = true;
	mushStem.receiveShadow = true;
	mushStem.translateY(55);
	mushStem.translateX(-40);
	//mushStem.translateZ(-radiusBottom);
	this.mesh.add(mushStem);
	

	
	const geomMushPoints = [];
	geomMushPoints.push( new THREE.Vector2( 0, 0 ));
	geomMushPoints.push( new THREE.Vector2( 0, 30 ));
	geomMushPoints.push( new THREE.Vector2( 20, 30 ))
	geomMushPoints.push( new THREE.Vector2( 30, 20 ));
	geomMushPoints.push( new THREE.Vector2( 40, 15 ));
	geomMushPoints.push( new THREE.Vector2( 40, 0 ));
	geomMushPoints.push( new THREE.Vector2( 33, -5 ));
	geomMushPoints.push( new THREE.Vector2( 27, -5 ));
	geomMushPoints.push( new THREE.Vector2( 27, 0 ));
	geomMushPoints.push( new THREE.Vector2( 0, 0 ));
	const geomMushCap = new THREE.LatheGeometry( geomMushPoints, 5,0, 2*3.14 );
	const matMushCap = new THREE.MeshBasicMaterial( { color: Colors.brownDark, shading: THREE.FlatShading} );
	this.mushCap = new THREE.Mesh( geomMushCap, matMushCap );
	this.mushCap.castShadow = true;
	this.mushCap.receiveShadow = true;
	this.mushCap.translateY(80);
	this.mushCap.translateX(-40);
	this.mushCap.translateZ(0);
	this.mesh.add( this.mushCap );
	
	// propeller
	var geomPropeller = new THREE.BoxGeometry(35,6,10,1,1,1);
	var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);

	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;
	// blades
	var geomBlade = new THREE.BoxGeometry(1,45,15,1,1,1);
	var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
	
	var blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(-8,0,0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	this.propeller.add(blade);
	this.propeller.position.set(-90,0,0);
	this.mesh.add(this.propeller);

};



var airplane;

function createPlane(){ 
	airplane = new AirPlane();
	airplane.mesh.scale.set(.25,.25,.25);
	airplane.mesh.position.y = 100;
	scene.add(airplane.mesh);
}


var DieRoll = function(){
	this.mesh = new THREE.Object3D(); 
	var geometryDie = new THREE.IcosahedronBufferGeometry(10, 0);
	var matDie = new THREE.MeshLambertMaterial({color:Colors.red});
	var Die = new THREE.Mesh(geometryDie, matDie);
	//console.log(this.mesh.geometry.attributes.position.array);
	this.mesh.add(Die);

}

var die;
var faceNormalsArray;
function createDie(){
	die = new DieRoll();
	die.mesh.position.y = 60;
	die.mesh.position.x = 0;
	die.mesh.position.z = 100;
	//console.log(die.mesh.children[0].geometry.attributes.normal.array);
	faceNormalsArray = die.mesh.children[0].geometry.attributes.normal.array;
	scene.add(die.mesh);

}


var hasBeenRolled = false;
var isRolling = false;
var displayNumber = false;
var isSelected = false;
var targetQuaternion = new THREE.Quaternion();
var rotationMatrix = new THREE.Matrix4();
//object used to track where we are in animation between loops
var dieAnimationFlags = {inRandomPhase: false, inInterpolationPhase: false};
const rollSpeed = 2;
var normal = new THREE.Vector3();
const clock = new THREE.Clock();

function rollDie(){
	//if flag to roll is on, send flag to remove previous number,
	//then randomly pick a face calculate the quaternion associated with it 
	//interpolate towards the chosen face at some speed
	//stop and flip animation 'isrolling' flag, then flip the flag to display new number
	const delta = clock.getDelta();
	if(hasBeenRolled){
		if(isRolling)
		{
			//you dont want to calculate quaternionss every frame, it gets costly
			if(!isSelected)
			{
				let chosenFaceIndex = Math.floor(Math.random()*20);
				//console.log(die.mesh.children[0]);
			

				//let randomPlace = new THREE.Vector3(-1+2*Math.random(), -1+2*Math.random(), -1+2*Math.random());
				//randomPlace.normalize();
				var chosenFaceNormal = new THREE.Vector3( faceNormalsArray[chosenFaceIndex*9],faceNormalsArray[chosenFaceIndex*9+1] , faceNormalsArray[chosenFaceIndex*9+2] );
				var vectorTowardsCamera = new THREE.Vector3(0,0.5,1);
				vectorTowardsCamera.normalize();
				targetQuaternion.setFromUnitVectors(chosenFaceNormal , vectorTowardsCamera);
				isSelected = true;
			}
			if ( ! die.mesh.quaternion.equals( targetQuaternion ) ) {

				const step = rollSpeed * delta;
				die.mesh.quaternion.rotateTowards( targetQuaternion, step );

			}
			else{
				//set isRolling to false. makes sure we reset flag for next time
				isRolling = false;
				animationdone = true;
				
				$("#diceRoller").animate({
					opacity: 1.0
				}, 1000, function(){
					//console.log(Planes[curPlane-1]);
					curPlane = numberRolled;
					FadeIn();
				});
			}

		}	
		else{
			//after we're done rolling we wanna flag the chosenface
			isSelected = false;
		}
	}
	else{
		//idle animation while waiting for the very first roll
		die.mesh.rotation.y += .01;
	}
	
}



var mousePos = {x:0, y:0};
var mousePosNormed = {x: 0, y: 0};
var clickPos = {x:0, y:0};

const cameraFarPos = 500;
const cameraNearPos = 150;
const planeMinSpeed=1.2;
const planeMaxSpeed=1.6;
// now handle the mousemove event

function handleMouseMove(event) {

	// here we are converting the mouse position value received 
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:
	
	var tx = -1 + (event.clientX / WIDTH)*2;

	// for the vertical axis, we need to inverse the formula 
	// because the 2D y-axis goes the opposite direction of the 3D y-axis
	
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}
var idle = true;
var idleAnimationCount = 0;
function handleClick(event) {
	onDiceRoll = false;
	$("#diceRoller").click(isOnDiceRoll);
	if(!onDiceRoll)
	{
		if(idle == false)
		{
			//flag indicates that the idle animation is now on and that the boat must be put into a bobbing animation
			idle = true;
			idleAnimationCount = 0;
			clickPos.x = -1 + (event.clientX / WIDTH)*2;
			clickPos.y =  1 - (event.clientY / HEIGHT)*2;

		}
		else{


			idle = false;

			

		}
	}

}
var onDiceRoll = false;
function isOnDiceRoll(){
	onDiceRoll = true;
}


function followMouse(){
	var targetX = normalize(mousePos.x, -1, 1, -100, 100);
	var targetY = normalize(mousePos.y, -1, 1, 25, 175);
	mousePosNormed.x = targetX;
	mousePosNormed.y = targetY;

	return {targetX,targetY};
}


function idleAnimation(){
	var targetX = normalize(clickPos.x,-1,1,-100,100);
	var targetY = normalize(Math.sin(idleAnimationCount),-1,1,-15,15) + normalize(clickPos.y,-1,1,25,175);
	idleAnimationCount+= 0.01
	if(idleAnimationCount >= 62831.8)
	{
		idleAnimationCount = 0;
	}
	return {targetX, targetY};

	
}
function normalize(v,vmin,vmax,tmin, tmax){
	
	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;

}


var flip = true;
var flipCount = 2*3.14;
const mushCapOriginalColor = new THREE.Color(Colors.mossGreen);
const mushCapChangeColor = new THREE.Color(Colors.oliveGreen);
function loop(){
	

	
	sea.moveWaves();
	if(idle)
	{
		sky.mesh.rotation.z+=.005;
	}
	else
	{
		sky.mesh.rotation.z += .008;
	}
	
	constellation.FadeInStars();

	//update the sun
	UpdateSunCycle();

	// update the plane on each frame
	updatePlane();

	//mess with the die
	rollDie();

	// render the scene
	renderer.render(scene, camera);


	// call the loop function again
	requestAnimationFrame(loop);

	SummonArms();

	function updatePlane(){
		if(idle == false)
		{
			targetCoord = followMouse();
			targetX = targetCoord.targetX;
			targetY = targetCoord.targetY;
			
		}
		else
		{
			targetCoord = idleAnimation();
			targetX = targetCoord.targetX;
			targetY = targetCoord.targetY;
		}
		
		

		// update the airplane's position, we use a different targetx and targety depending on whether we clicked or not
		// Move the plane at each frame by adding a fraction of the remaining distance
		airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.035;
		airplane.mesh.position.x += (targetX-airplane.mesh.position.x)*0.07;
		// Rotate the plane proportionally to the remaining distance
		airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0090;
		airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0050;

		//propeller animation. Extraspeed is between -0.0012 and 0.0024
		let propellerExtraSpeed = extraSpeed * 100;
		airplane.propeller.rotation.x += 0.4 + propellerExtraSpeed;

		if(flip)
		{
			flipCount += 0.015;	
			airplane.mushCap.scale.set(Math.sin(flipCount)/7+1.1, 1, Math.sin(flipCount)/7+1.1);	
			//airplane.mushCap.material.color.setHex(mushCapOriginalColor + flipCount*0x10);
			airplane.mushCap.material.color.lerpColors(mushCapOriginalColor, mushCapChangeColor , (0.5+Math.sin(flipCount)/2) );
			
			if(airplane.mushCap.position.y > 2*3.14)
			{
				flip = false;
			}
		}
		else
		{
			flipCount -= 0.015;
			airplane.mushCap.scale.set(Math.sin(flipCount)/7+1.1, 1 , Math.sin(flipCount)/7+1.1);
			//airplane.mushCap.material.color.setHex(mushCapOriginalColor + flipCount*0x10);
			airplane.mushCap.material.color.lerpColors(mushCapChangeColor ,mushCapOriginalColor , (0.5+Math.sin(flipCount)/2));
			if(airplane.mushCap.position.y < -2*3.14)
			{
				flip = true;
			}
		}
		
	}
	
}

function init()  
{

    //scene
    createScene();

    //lighting
    createLights();


    //objects
    createPlane();

    createSea();

	createSky();
	
	createDie(); //'die' meaning singular dice

	createConstellation();

	//add the listener
	document.addEventListener('mousemove', handleMouseMove, false);

	//leave it as mouseup, click causes the idle animation while rolling to bug out as it registers click
	//as 2 separate events

	document.addEventListener('mouseup', handleClick, false);



    //the loop that updates the objects per frame (i.e positions and animations)
    loop();
	
};
var numberRolled = 21;

window.addEventListener('load', init, false);
//jquery section
$(document).ready(function(){
	$('#TheUnseen').hide();
	originalCreditToMe = $('#creditToMe').text();
	originalTopTitle = $('#topTitle').text();
	originalMidTitle = $('#midTitle').text();
	originalBotTitle = $('#botTitle').text();
    //when we click diceRoller
    $("#diceRoller").click(function(){

		//console.log("What");
		//this idle = !idle line keeps the ship from flipflopping when pressing roll button
		idle = !idle;
		$("#diceRoller").animate({
			opacity: 0
		}, 200, GenerateNumber);
		if(hasBeenRolled == false)
		{
			hasBeenRolled = true;
		}
		if(isRolling == false)
		{
			isRolling = true;
		}
		
		//turning opacity to 0 while we change the insides
		$('#curWorld').animate({
			opacity:0
		}, 200);

		

	});
  });


function GenerateNumber(){
	// will be called when all the animations on the queue finish
	numberRolled = 1+Math.floor(Math.random()*20);//between 1 and 20
	//curPlane = numberRolled;
	$("#diceRoller").text(numberRolled);
	$("#diceRoller").css("font-size", 1.5 + "em");
	console.log("Yo");
};

function FadeIn (){

	var $all_msg = $('#curWorld');

	//turning opacity back to 1. it will be transparent otherwise
	jQuery('#curWorld').css('opacity', '1');

	var $wordList = Planes[curPlane-1].Name.split("");

	$('#curWorld').text("");

	//loop through the letters in the $wordList array
	$.each($wordList, function(idx, elem) {
	  //create a span for the letter and set opacity to 0
	  var newEL = $("<span/>").text(elem).css({
		opacity: 0
	  });
	  //append it to the welcome message
	  newEL.appendTo($all_msg);
	  //set the delay on the animation for this element
	  newEL.delay(idx * 90);
	  //animate the opacity back to full 1
	  newEL.animate({
		opacity: 1
	  }, 1100);
	});
	ChangeCreditColor();
	SummonUnseen();
  };

function ChangeCreditColor(){
	if(curPlane < 13 && curPlane!=1 && curPlane !=4)
	{
		$("#creditToMe").css("color","#804e52");
	}
	else
	{
		$("#creditToMe").css("color","#c0c0c0");
	}
	
}

var PlaneOfTheUnseen = Math.floor(Math.random()*20)+1;
console.log("A mysterious being spotted in", Planes[PlaneOfTheUnseen-1].Name);
//hide by default
$('#TheUnseen').hide();

function SummonUnseen(){
	if(curPlane == PlaneOfTheUnseen){
		$('#TheUnseen').show();
	}
	else{
		$('#TheUnseen').hide();
	}
}
var timeUntilScare = 0;
var flipped = false;
var originalCreditToMe;

var originalTopTitle;
var originalMidTitle;
var originalBotTitle;

function SummonArms()
{
	if(curPlane == PlaneOfTheUnseen)
	{
		if(timeUntilScare > 0 && timeUntilScare%500 == 0)
		{
			if(!flipped)
			{
				flipped = true;
				$('#UnseenArms').css('visibility',"visible");
				$('#creditToMe').text('UEYSEE HM TYK UOUY BOK LFOD ZVEJK KOIRRS');
				$('#topTitle').text('TF GABVX GIT YSMGKF');
				$('#midTitle').text('TPXONEOG');
			}

		}
		if(timeUntilScare > 0 && timeUntilScare%500 == 30)
		{
			if(flipped)
			{
				flipped = false;
				$('#UnseenArms').css('visibility',"hidden");
				$('#creditToMe').text(originalCreditToMe);
				$('#topTitle').text(originalTopTitle);
				$('#midTitle').text(originalMidTitle);
			
			}
		}
		timeUntilScare++;
	}
	else{
		timeUntilScare = 0;
		if(flipped)
		{
			$('#UnseenArms').css('visibility',"hidden");
			flipped = false;
		}
	}


}


