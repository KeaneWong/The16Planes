

var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,

};






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
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
}

// First let's define a Sea object :
Sea = function(){
	
	// create the geometry (shape) of the cylinder;
	// the parameters are: 
	// radius top, radius bottom, height, number of segments on the radius, number of segments vertically
	var geom = new THREE.CylinderGeometry(600,600,800,40,10);
	
	// rotate the geometry on the x axis
	geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	
	// create the material 
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.blue,
		transparent:true,
		opacity:.6,
		shading:THREE.FlatShading,
	});

	// To create an object in Three.js, we have to create a mesh 
	// which is a combination of a geometry and some material
	this.mesh = new THREE.Mesh(geom, mat);

	// Allow the sea to receive shadows
	this.mesh.receiveShadow = true; 
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

	/*
	//extrusion method

	const geomHull = new THREE.Shape();
	geomHull.moveTo(90, 45);
    geomHull.lineTo(90,30);
    geomHull.moveTo(90,30);
    geomHull.bezierCurveTo(90, 0, 50 ,-25, 30, -25);     
    //geomHull.moveTo(30,-25);
    geomHull.lineTo(-60,-25) ;  
    geomHull.moveTo(-60,-25);
    geomHull.bezierCurveTo(-90, -10, -80, -10, -90,15) ;
    geomHull.moveTo(-90,15);
    geomHull.lineTo(-90,45) ;
    geomHull.moveTo(-90,45);
    geomHull.lineTo(-60,45) ;
    geomHull.moveTo(-60,45);
    geomHull.lineTo(-60,30) ;
    geomHull.moveTo(-60,30);
    geomHull.lineTo(-30,30) ;   
	geomHull.moveTo(-30,30);
	geomHull.lineTo(35,30);
	geomHull.moveTo(35,30);
    geomHull.lineTo(35,45) ;    
    geomHull.moveTo(35,45);
    geomHull.lineTo(90,45) ;    
	geomHull.moveTo(90,45);
	const hullWidth = 50
	const extrudeSettingsHull = { depth: hullWidth, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
	const geometryHull = new THREE.ExtrudeGeometry( geomHull, extrudeSettingsHull );
	*/
	const hullPoints = [];
	const geomHull = new THREE.Shape();
   
    geomHull.moveTo(35,-25);
    geomHull.lineTo(-60,-25) ;  
    geomHull.moveTo(-60,-25);
    geomHull.bezierCurveTo(-90, -10, -80, -10, -90,15) ;
    geomHull.moveTo(-90,15);
    geomHull.lineTo(-90,45) ;
    geomHull.moveTo(-90,45);
    geomHull.lineTo(-60,45) ;
    geomHull.moveTo(-60,45);
    geomHull.lineTo(-60,30) ;
    geomHull.moveTo(-60,30);
    geomHull.lineTo(-30,30) ;   
	geomHull.moveTo(-30,30);
	geomHull.lineTo(35,30);
	geomHull.moveTo(35,30);
    geomHull.lineTo(35,45) ;    
	geomHull.moveTo(35,45);
	geomHull.lineTo(35,-25);
	const hullWidth = 50
	const extrudeSettingsHull = { depth: hullWidth, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
	const geometryHull = new THREE.ExtrudeGeometry( geomHull, extrudeSettingsHull );
	console.log(geometryHull);
	var matHull = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var hull = new THREE.Mesh(geometryHull, matHull);
	hull.castShadow = true;
	hull.receiveShadow = true;
	hull.translateZ(-(hullWidth/2));
	console.log(hull);
	this.mesh.add(hull);

	//the mesh and geometry that determines the deck of the bow of the ship
	geomBowTopPoints = [];
	const ForegroundDeckCurve = new THREE.QuadraticBezierCurve3(
		new THREE.Vector3( 35, 45, hullWidth/2 ),
		new THREE.Vector3( 60, 45, 2*hullWidth/3 ),
		new THREE.Vector3( 90, 45, hullWidth/10 )
	);
	const FDCPoints = ForegroundDeckCurve.getPoints(10);	//array containing foreground curve points, a subarray of geomBowTopPoints
	geomBowTopPoints = geomBowTopPoints.concat(FDCPoints);
	geomBowTopPoints.push(new THREE.Vector3(90,45,hullWidth/10));
	geomBowTopPoints.push(new THREE.Vector3(90,45,-hullWidth/10));
	const BackgroundDeckCurve = new THREE.QuadraticBezierCurve3(
		new THREE.Vector3( 90, 45, -hullWidth/10 ),
		new THREE.Vector3( 60, 45, -2*hullWidth/3 ),
		new THREE.Vector3( 35, 45, -hullWidth/2 )
	);
	const BDCPoints = BackgroundDeckCurve.getPoints(10);
	geomBowTopPoints = geomBowTopPoints.concat(BDCPoints);
	geomBowTopPoints.push(new THREE.Vector3(35,45,hullWidth/2));
	console.log(geomBowTopPoints);
	GeometryBowDeck= new THREE.BufferGeometry().setFromPoints( geomBowTopPoints ); 
	//GeometryBowDeck = new THREE.BufferGeometry().setAttribute( 'position', new THREE.BufferAttribute( geomBowTopPoints, 3 ) );
	console.log(GeometryBowDeck);

	const BowDeck = new THREE.Mesh(GeometryBowDeck,matHull);
	BowDeck.castShadow=true;
	BowDeck.receiveShadow = true;
	console.log(BowDeck);
	this.mesh.add(BowDeck);

	/* complete: Cabin box
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
	var matCabin = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FLatShading});
	var cabin = new THREE.Mesh(geometryCabin, matCabin);
	cabin.castShadow = true;
	cabin.receiveShadow = true;
	cabin.translateZ(-cabinWidth/2);
	this.mesh.add(cabin);
	*/

	/* complete: mushroom
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

	this.mesh.add(mushStem);
	
	*/
	/*
	
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
	const geomMushCap = new THREE.LatheGeometry( geomMushPoints );
	const matMushCap = new THREE.MeshBasicMaterial( { color: Colors.red, shading: THREE.FlatShading } );
	const mushCap = new THREE.Mesh( geomMushCap, matMushCap );
	mushCap.translateY(80);
	mushCap.translateX(-40);
	mushCap.translateZ(25);
	this.mesh.add( mushCap );
	*/
	

	
	//from previous iteration/airplane: DEPRECATED
	/*
	// Create the cabin
	var geomCockpit = new THREE.BoxGeometry(80, 50, 50,1,1,1);
	geomCockpit.dynamic = true;
	geomCockpit.attributes.position.needsUpdate = true;
	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	
	geomVertices = geomCockpit.attributes.position.array;
	console.log(geomCockpit);

	geomCockpit.setDrawRange(0,100);

	//geomCockpit.attributes.position.needsUpdate = true;
	console.log(geomCockpit);
	geomCockpit.attributes.position.needsUpdate = true;

	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);



	// Create the engine
	var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
	var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);
	
	// Create the tail
	var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
	var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35,25,0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);
	
	// Create the wing
	var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
	var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	this.mesh.add(sideWing);
	
	// propeller
	var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
	var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;
	
	// blades
	var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
	var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
	
	var blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8,0,0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	this.propeller.add(blade);
	this.propeller.position.set(50,0,0);
	this.mesh.add(this.propeller);
	*/
};


var airplane;

function createPlane(){ 
	airplane = new AirPlane();
	airplane.mesh.scale.set(.25,.25,.25);
	airplane.mesh.position.y = 100;
	scene.add(airplane.mesh);
}


var mousePos={x:0, y:0};

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

function loop(){
	// Rotate the propeller, the sea and the sky
	//airplane.propeller.rotation.x += 0.3;
	sea.mesh.rotation.z += .005;
	sky.mesh.rotation.z += .01;

	// update the plane on each frame
	updatePlane();

	// render the scene
	renderer.render(scene, camera);



	// call the loop function again
	requestAnimationFrame(loop);

	function updatePlane(){

		// let's move the airplane between -100 and 100 on the horizontal axis, 
		// and between 25 and 175 on the vertical axis,
		// depending on the mouse position which ranges between -1 and 1 on both axes;
		// to achieve that we use a normalize function (see below)
		
		var targetX = normalize(mousePos.x, -1, 1, -100, 100);
		var targetY = normalize(mousePos.y, -1, 1, 25, 175);
		
		// update the airplane's position
		airplane.mesh.position.y = targetY;
		airplane.mesh.position.x = targetX;
		//airplane.propeller.rotation.x += 0.3;
	}
	
	function normalize(v,vmin,vmax,tmin, tmax){
	
		var nv = Math.max(Math.min(v,vmax), vmin);
		var dv = vmax-vmin;
		var pc = (nv-vmin)/dv;
		var dt = tmax-tmin;
		var tv = tmin + (pc*dt);
		return tv;
	
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

	//add the listener
	document.addEventListener('mousemove', handleMouseMove, false);


    //the loop that updates the objects per frame (i.e positions and animations)
    loop();
	
};

window.addEventListener('load', init, false);