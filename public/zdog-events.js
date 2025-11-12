// namespace
window.ZdogSpookyHouse = window.ZdogSpookyHouse || {
  wobbling: true,
  sceneY: 12,
  hillScale: 0.75,
  color: {
    deep: 'hsl(230, 60%, 40%)',
    dark: 'hsl(230, 60%, 50%)',
    darker: '#2a3a81',
    medium: 'hsl(230, 60%, 60%)',
    light: 'hsl(230, 60%, 70%)',
    pale: '#6D77AD',
    highlight: '#FFB',
    fog: 'hsla(230, 60%, 80%, 0.4)',
    paintjob: '#d59c55',
  }
};

// ------------------------- bones ------------------------- //

ZdogSpookyHouse.addBones = function( options ) {
  if (typeof Zdog === 'undefined' || typeof window === 'undefined' || !window.ZdogSpookyHouse) return;
  var TAU = Zdog.TAU;
  var lineX = 2;
  var color = ZdogSpookyHouse.color.light;
  var stroke = 1.3;

  var line = new Zdog.Shape({
    addTo: options.addTo,
    path: [ { x: -lineX }, { x: lineX } ],
    closed: false,
    stroke: stroke,
    color: color,
    translate: { y: 12, z: -30 },
    rotate: { y: TAU/16, z: TAU/16 },
  });

  var halfFemur = line.copy({
    translate: { x: -6, y: 15, z: -28 },
    rotate: { y: -TAU/8, z: TAU/8 },
  });
  var femurEnd = line.copy({
    addTo: halfFemur,
    path: [
      { x: 1, y: -1 },
      { x: 0, y:  0 },
      { x: 1, y:  1 },
    ],
    closed: false,
    rotate: null,
    translate: { x: lineX },
  });

  halfFemur.copyGraph({
    translate: { x: 1, y: 6, z: -31 },
    rotate: { z: -TAU/8, x: TAU/8 },
    scale: 0.75,
  });

  line.copy({
    scale: 0.25,
    translate: { y: 18, z: -26 },
    rotate: { z: TAU/8 },
  });

  var fullFemur = halfFemur.copyGraph({
    translate: { x: -9, y: 10, z: -30 },
    rotate: { z: -TAU/16 },
  });
  femurEnd.copy({
    addTo: fullFemur,
    scale: { x: -1 },
    translate: { x: -lineX },
  });

  line.copy({
    scale: 0.4,
    translate: { x: -12, y: 14, z: -28 },
    rotate: { z: -TAU/16 },
  });

};
// ------------------------- car & road ------------------------- //

ZdogSpookyHouse.addCarRoad = function( options ) {
  if (typeof Zdog === 'undefined') return { animate: function() {} };
  var color = ZdogSpookyHouse.color;
  var TAU = Zdog.TAU;

  var roadRadius = 120;

  var roadSegmentCount = 40;
  var roadSegmentZ = 5;
  var roadSegmentX = (roadRadius + roadSegmentZ) * TAU / roadSegmentCount / 2;

  var roadSegmentPath = [
    { x: -roadSegmentX + 1, z:  roadSegmentZ },
    { x:  roadSegmentX - 1, z:  roadSegmentZ },
    { x:  roadSegmentX,     z: -roadSegmentZ },
    { x: -roadSegmentX,     z: -roadSegmentZ },
  ];

  for ( var i = 0; i < roadSegmentCount; i++ ) {
    var roadAngle = i/roadSegmentCount * TAU;
    new Zdog.Shape({
      addTo: options.addTo,
      path: roadSegmentPath,
      translate: {
        x: Math.cos( roadAngle ) * roadRadius,
        z: Math.sin( roadAngle ) * roadRadius,
      },
      rotate: { y: roadAngle + TAU/4 },
      fill: true,
      stroke: 2,
      color: color.deep,
    });
  }

  // car
  var bottomY = -1;
  var middleY = -2.5;
  var topY = -4.5;
  var outerZ = 2.5;
  var innerZ = 1.5;
  var grillX = -5;
  var hoodX = -4;
  var wipersX = -2;
  var windshieldX = -1;
  var roofX = 2;
  var trunkX = 4;
  var bumperX = 5;

  var driverPoints = {
    grill: new Zdog.Vector({ x: grillX, y: bottomY, z: outerZ }),
    hood: new Zdog.Vector({ x: hoodX, y: middleY, z: outerZ }),
    wipers: new Zdog.Vector({ x: wipersX, y: middleY, z: outerZ }),
    windshield: new Zdog.Vector({ x: windshieldX, y: topY, z: innerZ }),
    roof: new Zdog.Vector({ x: roofX, y: topY, z: innerZ }),
    trunk: new Zdog.Vector({ x: trunkX, y: middleY, z: outerZ }),
    bumper: new Zdog.Vector({ x: bumperX, y: bottomY, z: outerZ }),
  };

  // copy to passenger points on other z side
  var passengerPoints = {};
  for ( var pointName in driverPoints ) {
    var driverPoint = driverPoints[ pointName ];
    passengerPoints[ pointName ] = driverPoint.copy().multiply({ z: -1 });
  }

  var carRotor = new Zdog.Anchor({
    addTo: options.addTo,
  });

  var carAnchorY = -6;

  var carAnchor = new Zdog.Group({
    addTo: carRotor,
    translate: { z: roadRadius - 0, y: carAnchorY },
    scale: 1.2,
    updateSort: true,
  });

  var carSide = new Zdog.Shape({
    addTo: carAnchor,
    path: [
      driverPoints.grill, driverPoints.hood, driverPoints.wipers,
      driverPoints.windshield, driverPoints.roof, driverPoints.trunk,
      driverPoints.bumper
    ],
    stroke: 2,
    fill: true,
    color: color.paintjob,
  });
  carSide.copy({
    scale: { z: -1 },
  });

  function getCarPanel( pointNameA, pointNameB, color ) {
    return carSide.copy({
      path: [
        driverPoints[ pointNameA ], driverPoints[ pointNameB ],
        passengerPoints[ pointNameB ], passengerPoints[ pointNameA ],
      ],
      color: color || carSide.color,
    });
  }

  getCarPanel( 'grill', 'hood' ); // front grill
  getCarPanel( 'hood', 'wipers' ); // hood
  getCarPanel( 'wipers', 'windshield', color.medium ); // windshield
  getCarPanel( 'windshield', 'roof' ); // roof
  getCarPanel( 'roof', 'trunk', color.medium ); // back window
  getCarPanel( 'trunk', 'bumper' ); // back bumper

  var tireTranslate = new Zdog.Vector({ x: -3.5, z: outerZ, y: bottomY });

  var tire = new Zdog.Ellipse({
    addTo: carAnchor,
    diameter: 1.8,
    translate: tireTranslate,
    stroke: 2,
    fill: true,
    color: color.paintjob,
  });
  tire.copy({
    translate: tireTranslate.copy().multiply({ x: -1 }),
  });
  tire.copy({
    translate: tireTranslate.copy().multiply({ z: -1 }),
  });
  tire.copy({
    translate: tireTranslate.copy().multiply({ x: -1, z: -1 }),
  });

  function animate( progress ) {
    var TAU = Zdog.TAU;
    carRotor.rotate.y = Zdog.easeInOut( progress/4 % 1 ) * TAU + TAU * 3/8;
    carAnchor.rotate.x = Math.sin( progress * TAU * 2 ) * 0.1;
    carAnchor.translate.y = Math.sin( progress * TAU * 1.5 ) * 2 + carAnchorY;
  }

  return {
    animate: animate,
  };

};
// ------------------------- cats ------------------------- //

ZdogSpookyHouse.addCats = function( options ) {
  if (typeof Zdog === 'undefined') return;
  var TAU = Zdog.TAU;
  var color = ZdogSpookyHouse.color;

  var catScale = 1.1;

  var cat = new Zdog.Anchor({
    addTo: options.addTo,
    translate: { z: -22, x: -28, y: -2 },
    scale: catScale,
    rotate: { y: TAU/8 },
  });

  new Zdog.Cone({
    addTo: cat,
    diameter: 1,
    length: 3,
    rotate: { x: TAU/4 },
    stroke: 4 * catScale,
    color: color.deep,
  });

  var catHead = new Zdog.Shape({
    addTo: cat,
    translate: { y: -4 },
    stroke: 5 * catScale,
    color: color.deep,
  });

  var catEye = new Zdog.Shape({
    addTo: catHead,
    translate: { x: -1, z: 1 },
    stroke: 0.9 * catScale,
    color: color.highlight,
  });
  catEye.copy({
    translate: { x: 1, z: 1 },
  });

  var catEarPointA = { x: -1, y:  1 };
  var catEarPointB = { x: -1, y: -1 };
  var catEarPointC = { x:  1, y:  1 };
  var catEarPointD = { x:  1, y:  1, z: -1 };

  var catEar = new Zdog.Anchor({
    addTo: catHead,
    scale: new Zdog.Vector({ x: 1, y: 1, z: 1.25 }),
  });

  var catEarPanel = new Zdog.Shape({
    addTo: catEar,
    path: [ catEarPointA, catEarPointB, catEarPointD ],
    translate: { x: -0.96, y: -1.5, z: 0 },
    stroke: 0.6 * catScale,
    fill: true,
    color: color.deep,
  });
  catEarPanel.copy({
    path: [ catEarPointB, catEarPointC, catEarPointD ],
  });

  catEar.copyGraph({
    scale: catEar.scale.copy().multiply({ x: -1 }),
  });

  // tail
  new Zdog.Shape({
    addTo: cat,
    path: [
      {},
      { bezier: [
        { x:  4, y:  0, z: -4 },
        { x:  0, y: -3, z: 0 },
        { x:  3, y: -5, z: -1 },
      ]},
    ],
    closed: false,
    translate: { z: -1 },
    stroke: 0 * catScale,
    color: color.deep,
  });

  cat.copyGraph({
    translate: { z: -6, x: -42, y: -15 },
    scale: catScale,
    rotate: { y: TAU/4 },
  });

  cat.copyGraph({
    translate: { z: -30, x: -30, y: -2 },
    scale: catScale,
    rotate: { y: TAU/4 },
  });

};
// ------------------------- fogMonster ------------------------- //

ZdogSpookyHouse.addFogMonster = function( options ) {
  if (typeof Zdog === 'undefined') return { animate: function() {} };
  var TAU = Zdog.TAU;
  var color = ZdogSpookyHouse.color;

  var radius = 54;

  var rotor = new Zdog.Anchor( options );

  // segments
  var segmentCount = 74;
  var trailEndAngle = TAU * 4/8;

  var segments = [];

  for ( var i = 0; i < segmentCount; i++ ) {
    var alpha = i / segmentCount;
    var angle = alpha * trailEndAngle;
    var segment = new Zdog.Shape({
      addTo: rotor,
      path: [ {}, { x: radius * TAU / segmentCount * 0.8 } ],
      stroke: 22 + 8 * -Math.cos( TAU/8 * ( 3 + alpha * 5 ) ),
      translate: {
        x: Math.sin( angle ) * radius,
        z: Math.cos( angle ) * radius,
        y: Math.sin( angle * 4 ) * 6,
      },
      rotate: { y: alpha * -trailEndAngle },
      color: color.fog,
    });
    segments.push( segment );
  }

  var monsterEye = new Zdog.Shape({
    addTo: segments[0],
    translate: { x: -10, z: 8 },
    color: color.deep,
    stroke: 3.5,
  });
  monsterEye.copy({
    translate: { x: -10, z: -8 },
  });

  new Zdog.Ellipse({
    addTo: segments[0],
    translate: { x: -10, y: 4 },
    quarters: 2,
    rotate: { z: TAU/4, y: TAU/4 },
    closed: true,
    diameter: 8,
    stroke: false,
    fill: true,
    color: color.deep,
  });

  function animate( progress ) {
    var rotorRY = rotor.rotate.y = progress * TAU/6;
    segments.forEach( function( segment, i ) {
      var alpha = i / segmentCount;
      var angle = alpha * trailEndAngle;
      segment.translate.y = Math.sin( (angle - rotorRY) * 4 ) * 6;
    });
  }

  return {
    animate: animate,
  };

};

ZdogSpookyHouse.addHouse = function( options ) {
  if (typeof Zdog === 'undefined') return { shape: null, animate: function() {} };

  var TAU = Zdog.TAU;
  var color = ZdogSpookyHouse.color;

  var eastWestWallRects = [];
  var southWallRects = [];

  function addEastWestWallRect( rect ) {
    eastWestWallRects.push( rect );
  }

  function addSouthWallRect( rect ) {
    southWallRects.push( rect );
  }

  var house = new Zdog.Anchor({
    addTo: options.addTo,
    translate: { x: 0, y: -8, z: -6 },
  });

  var wallPanelOptions = {
    addTo: house,
    width: 12,
    height: 12,
    stroke: options.stroke,
    fill: true,
    backface: color.deep,
  };

  var southWallPanelOptions = Object.assign( {
    color: color.light,
  }, wallPanelOptions );

  // south wall, front door
  var frontDoorGroup = new Zdog.Group({
    addTo: house,
    translate: { z: 24 },
  });

  addSouthWallRect( new Zdog.Rect( Object.assign( {}, southWallPanelOptions, {
    addTo: frontDoorGroup,
  }) ) );

  new Zdog.Rect({
    addTo: frontDoorGroup,
    width: 6,
    height: 8,
    translate: { y: 2 },
    color: color.dark,
    fill: true,
    stroke: false,
  });

  ZdogSpookyHouse.getWallPanel({ // south wall, 2nd floor
    wall: Object.assign( {
      translate: { y: -12, z: 24 }
    }, southWallPanelOptions ),
    pane: color.medium,
    wallRectCallback: addSouthWallRect,
  });

  ZdogSpookyHouse.getWallPanel({ // 3rd floor, window on
    wall: Object.assign( {
      translate: { y: -24, z: 24 },
    }, southWallPanelOptions ),
    pane: color.highlight,
    wallRectCallback: addSouthWallRect,
  });

  var eastWallPanelOptions = Object.assign( {
    color: color.medium,
    rotate: { y: -TAU/4 },
  }, wallPanelOptions );

  var westWallPanelOptions = Object.assign( {
    color: color.medium,
    rotate: { y: TAU/4 },
  }, wallPanelOptions );

  // entrance side facing east
  var eastWallSquare = new Zdog.Rect( Object.assign( {}, eastWallPanelOptions, {
    translate: { x: 6, z: 18, },
  }));
  addEastWestWallRect( eastWallSquare );
  addEastWestWallRect( eastWallSquare.copy({ // 2nd floor
    translate: { x: 6, y: -12, z: 18, },
  }) );
  addEastWestWallRect( eastWallSquare.copy({ // 3rd floor
    translate: { x: 6, y: -24, z: 18, },
  }) );

  // entrance west
  var westWallSquare = eastWallSquare.copy({
    translate: { x: -6, z: 18, },
    rotate: { y: TAU/4 },
  });
  addEastWestWallRect( westWallSquare );
  addEastWestWallRect( westWallSquare.copy({ // 2nd floor
    translate: { x: -6, y: -12, z: 18, },
  }) );
  addEastWestWallRect( westWallSquare.copy({ // 3rd floor
    translate: { x: -6, y: -24, z: 18, },
  }) );

  // entrance roof
  var entranceRoof = new Zdog.Anchor({
    addTo: house,
    translate: { y: -36, z: 18 },
  });

  var entranceRoofPanel = new Zdog.Shape({
    addTo: entranceRoof,
    path: [
      { x: -8, y:  6 },
      { x:  8, y:  6 },
      { x:  4, y: -6, z: -4 },
      { x: -4, y: -6, z: -4 },
    ],
    translate: { z: 8 },
    stroke: options.stroke,
    fill: true,
    color: color.dark,
  });
  entranceRoofPanel.copy({
    rotate: { y: TAU/4 },
    translate: { x: -8 },
  });
  entranceRoofPanel.copy({
    rotate: { y: TAU/2 },
    translate: { z: -8 },
    color: color.deep,
  });
  entranceRoofPanel.copy({
    rotate: { y: TAU * 3/4 },
    translate: { x: 8 },
    color: color.deep,
  });
  // roof cap
  new Zdog.Rect({
    addTo: entranceRoof,
    width: 8,
    height: 8,
    rotate: { x: -TAU/4 },
    translate: { y: -6 },
    stroke: options.stroke,
    fill: true,
    color: color.dark,
  });

  function animate( progress, rotation ) {
    var degrees = Math.abs( Math.round( rotation.y / TAU * 360 ) - 180 );
    var isLightOn = degrees <= 50 || ( degrees >= 60 && degrees <= 65 );
    var eastWestBackface = isLightOn ? color.highlight : color.deep;
    var southBackface = isLightOn ? true : color.deep;

    eastWestWallRects.forEach( function( rect ) {
      rect.backface = eastWestBackface;
    });
    southWallRects.forEach( function( rect ) {
      rect.backface = southBackface;
    });
  }

  return {
    shape: house,
    animate: animate,
  };

};
// ------------------------- addInteriorScene ------------------------- //

ZdogSpookyHouse.addInteriorScene = function( options ) {
  if (typeof Zdog === 'undefined') return { animate: function() {} };
  
  var color = ZdogSpookyHouse.color;
  var TAU = Zdog.TAU;
  var downLinePath = [ { y: 0 }, { y: 1 } ];

  var interiorScene = new Zdog.Anchor({
    addTo: options.addTo,
    translate: options.translate,
    rotate: options.rotate,
  });

  var furnitureColor = color.medium;
  var tableWidth = 9;
  var tableDepth = 4;
  var tableStroke = 1.5;

  // ----- table ----- //

  var tableAnchor = new Zdog.Anchor({
    addTo: interiorScene,
    rotate: { z: 0.1 },
  });

  // table top
  new Zdog.Rect({
    addTo: tableAnchor,
    width: tableWidth,
    height: tableDepth,
    rotate: { x: TAU/4 },
    fill: true,
    color: furnitureColor,
    stroke: tableStroke,
  });

  var tableLeg = new Zdog.Shape({
    addTo: tableAnchor,
    path: downLinePath,
    scale: 3,
    translate: { x: -tableWidth/2, z: -tableDepth/2 },
    color: furnitureColor,
    stroke: tableStroke,
  });
  tableLeg.copy({
    translate: { x: tableWidth/2, z: -tableDepth/2 },
  });
  tableLeg.copy({
    translate: { x: tableWidth/2, z:  tableDepth/2 },
  });
  tableLeg.copy({
    translate: { x: -tableWidth/2, z: tableDepth/2 },
  });

  // ----- monitor ----- //

  var monitorWidth = 10;
  var monitorHeight = 5;

  var monitorAnchor = new Zdog.Anchor({
    addTo: tableAnchor,
    translate: { y: -8 },
  });

  var screenGroup = new Zdog.Group({
    addTo: monitorAnchor,
    rotate: { y: TAU/2 },
  });
  // screen bevel
  var screenBevel = new Zdog.Rect({
    addTo: screenGroup,
    width: monitorWidth,
    height: monitorHeight,
    color: color.deep,
    fill: true,
    stroke: 1.5,
  });
  // screen display
  new Zdog.Rect({
    addTo: screenGroup,
    width: monitorWidth - 0.5,
    height: monitorHeight - 0.5,
    color: color.highlight,
    backface: false,
    fill: true,
    stroke: false,
  });
  // monitor stand base
  screenBevel.copy({
    addTo: monitorAnchor,
    width: 5,
    height: 2,
    rotate: { x: TAU/4 },
    translate: { y: 5 },
  });
  // monitor stand leg
  new Zdog.Shape({
    addTo: monitorAnchor,
    path: downLinePath,
    scale: 2,
    translate: { y: 3.1 },
    stroke: 1.5,
    color: color.deep,
  });

  // ----- chair ----- //

  var chairAnchor = new Zdog.Anchor({
    addTo: interiorScene,
    translate: { z: -15 },
    rotate: { z: -0.1 },
  });
  // chair seat
  new Zdog.Rect({
    addTo: chairAnchor,
    width: 3,
    height: 3,
    rotate: { x: TAU/4 },
    fill: true,
    stroke: tableStroke,
    color: furnitureColor,
  });
  // chair stem
  new Zdog.Shape({
    addTo: chairAnchor,
    path: downLinePath,
    scale: 3,
    stroke: tableStroke,
    color: furnitureColor,
  });
  // chair leg
  var chairLeg = new Zdog.Shape({
    addTo: chairAnchor,
    path: [ {}, { z: -2.5, y: 0.5 } ],
    translate: { y: 3 },
    stroke: 1,
    color: furnitureColor,
  });
  chairLeg.copy({ rotate: { y: TAU/5 * 1 } });
  chairLeg.copy({ rotate: { y: TAU/5 * 2 } });
  chairLeg.copy({ rotate: { y: TAU/5 * 3 } });
  chairLeg.copy({ rotate: { y: TAU/5 * 4 } });
  // chair back
  new Zdog.Rect({
    addTo: chairAnchor,
    width: 3,
    height: 4,
    translate: { z: -2.5, y: -2 },
    rotate: { x: 0.2 },
    stroke: tableStroke,
    color: furnitureColor,
    fill: true,
  });

  // ----- figure ----- //

  var figureColor = color.deep;
  var figureStroke = 1.5;
  var waistX = 1;
  var shoulderX = 1.5;
  var shoulderY = -3;
  var figureY = -6;

  var figure = new Zdog.Anchor({
    addTo: interiorScene,
    translate: { z: -13, y: figureY },
    scale: 0.6,
  });
  // torso
  var torso = new Zdog.Shape({
    addTo: figure,
    path: [
      { x: -waistX },
      { x: -shoulderX, y: shoulderY },
      { x:  shoulderX, y: shoulderY },
      { x:  waistX },
    ],
    rotate: { x: 0.4 },
    stroke: figureStroke,
    color: figureColor,
    fill: true,
  });
  // head
  new Zdog.Shape({
    addTo: torso,
    path: downLinePath,
    scale: -1,
    translate: { y: shoulderY - 2.5 },
    stroke: figureStroke + 1,
    color: figureColor,
  });
  var arm = new Zdog.Shape({
    addTo: torso,
    path: [
      {},
      { y: 3 },
      { z: 2, y: 4 },
    ],
    translate: { x: -shoulderX, y: shoulderY },
    rotate: { x: 1, z: 0.5 },
    scale: 1.25,
    closed: false,
    stroke: figureStroke,
    color: figureColor,
  });
  arm.copy({
    translate: { x: shoulderX, y: shoulderY },
    rotate: { z: -1 },
  });

  var bum = new Zdog.Shape({
    addTo: figure,
    path: [ { x: -waistX }, { x: waistX } ],
    translate: { y: 2, z: 0.5 },
    stroke: figureStroke + 0.5,
    color: figureColor,
  });

  var leg = arm.copy({
    addTo: bum,
    scale: { x: 1.75, y: 1.75, z: -1.75 },
    translate: { x: -waistX - 0.5 },
    rotate: { x: 1.8, z: 0.1 },
  });
  leg.copy({
    translate: { x: waistX + 0.5 },
    rotate: { x: 1, z: -0.2 },
  });

  function animate( progress ) {
    tableAnchor.translate.y = Math.sin( progress * 6 ) * -1;
    chairAnchor.translate.y = Math.sin( progress * 7 ) * 2;
    figure.translate.y = Math.sin( progress * 8 ) * 2 + figureY;
  }

  return {
    animate: animate,
  };

};
// ------------------------- getConeTree ------------------------- //

// Define Zdog.extend once at the top level if it doesn't exist
if (typeof Zdog !== 'undefined' && !Zdog.extend) {
  Zdog.extend = function( target, source ) {
    for ( var key in source ) {
      target[key] = source[key];
    }
    return target;
  };
}

ZdogSpookyHouse.getConeTree = function( options ) {
  if (typeof Zdog === 'undefined') return null;

  Zdog.extend( options, {
    rotate: { x: Zdog.TAU/4 },
    stroke: false,
    color: ZdogSpookyHouse.color.deep,
  });

  var treeCone = new Zdog.Cone( options );
  treeCone.copy({
    addTo: treeCone,
    rotate: null,
    translate: { z: Math.round( options.length /2 ) },
  });
  
  return treeCone;
};
// ------------------------- getGraveIsland ------------------------- //

ZdogSpookyHouse.getGraveIsland = function( options ) {
  if (typeof Zdog === 'undefined') return null;
  var TAU = Zdog.TAU;
  var color = ZdogSpookyHouse.color;

  var island = new Zdog.Anchor({
    addTo: options.addTo,
    translate: options.translate,
  });

  var size = 9;

  ZdogSpookyHouse.getPyramid({
    addTo: island,
    scale: { x: size, y: -size, z: size },
    color: color.deep,
    snub: options.snub,
  });

  new Zdog.Rect({
    width: size*2,
    height: size*2,
    addTo: island,
    rotate: { x: TAU/4 },
    color: color.dark,
    stroke: 4,
    fill: true,
  });

  // tombstone
  var tombstone = new Zdog.Rect({
    addTo: island,
    width: 4,
    height: 4,
    translate: { x: -4, y: -6 },
    rotate: { y: TAU/4 },
    stroke: 3,
    color: color.medium,
  });

  new Zdog.Ellipse({
    addTo: tombstone,
    diameter: 4,
    translate: { y: -2 },
    stroke: 3,
    color: color.medium,
  });

  return island;
};
// ------------------------- getPyramid ------------------------- //

( function() {
  var TAU = Zdog.TAU;
  var ROOT2 = Math.sqrt(2);

  var pyramidFacePath = [
    { x: -1 },
    { x:  1 },
    { y: -ROOT2 },
  ];

  var snubPyramidFacePath = [
    { x: -1 },
    { x:  1 },
    { x:  0.5, y: -0.5 * ROOT2 },
    { x: -0.5, y: -0.5 * ROOT2 },
  ];

  ZdogSpookyHouse.getPyramid = function( options ) {
    if (typeof Zdog === 'undefined') return null;

    var pyramid = new Zdog.Anchor({
      addTo: options.addTo,
      translate: options.translate,
      scale: options.scale,
      rotate: options.rotate,
    });

    var stroke = options.stroke || 4;

    var faceRotor = new Zdog.Anchor({
      addTo: pyramid,
    });

    new Zdog.Shape({
      addTo: faceRotor,
      path: options.snub ? snubPyramidFacePath : pyramidFacePath,
      translate: { z: 1 },
      rotate: { x: TAU/8 },
      stroke: stroke,
      fill: true,
      color: options.color,
      backface: options.backface !== undefined ? options.backface : true,
    });

    faceRotor.copyGraph({
      rotate: { y: TAU/4 },
    });
    faceRotor.copyGraph({
      rotate: { y: TAU/2 },
    });
    faceRotor.copyGraph({
      rotate: { y: TAU * 3/4 },
    });

    if ( options.snub ) {
      // snub base
      new Zdog.Rect({
        addTo: pyramid,
        translate: { y: -0.5 },
        rotate: { x: -TAU/4 },
        color: options.color,
        stroke: 4,
        fill: true,
      });
    }

    return pyramid;

  };

})();
// ------------------------- getWallPanel ------------------------- //

( function() {

  var wallChildProperties = [ 'color', 'stroke', 'fill', 'width', 'height',
      'backface' ];

  ZdogSpookyHouse.getWallPanel = function( options ) {
    if (typeof Zdog === 'undefined') return null;
    var wallPanel;
    if ( !options.pane ) {
      wallPanel = new Zdog.Rect( options.wall );
      if ( options.wallRectCallback ) {
        options.wallRectCallback( wallPanel );
      }
    } else {
      wallPanel = getWallPanelGroup( options );
    }
    return wallPanel;
  };

  function getWallPanelGroup( options ) {
    var group = new Zdog.Group( options.wall );

    // wall panel
    var panelOptions = wallChildProperties.reduce( function( wallOptions, prop ) {
      wallOptions[ prop ] = options.wall[ prop ];
      return wallOptions;
    }, {} );
    panelOptions.addTo = group;

    // wall rect
    var wallRect = new Zdog.Rect( panelOptions );
    if ( options.wallRectCallback ) {
      options.wallRectCallback( wallRect );
    }

    // shutters
    new Zdog.Rect({
      addTo: group,
      width: 8,
      height: 6,
      translate: { y: -1 },
      color: ZdogSpookyHouse.color.dark,
      fill: true,
      stroke: false,
      backface: false,
    });
    // window
    new Zdog.Rect({
      addTo: group,
      width: 4,
      height: 6,
      translate: { y: -1 },
      color: options.pane,
      fill: true,
      stroke: false,
    });

    return group;

  }

})();

// ------------------------- getLeafTree ------------------------- //

ZdogSpookyHouse.getLeafTree = function( options ) {
  if (typeof Zdog === 'undefined') return null;
  
  var TAU = Zdog.TAU;
  var color = ZdogSpookyHouse.color;

  var branchPath = [
    { move: { x:   0, y:  14 }},
    { line: { x: -12, y:   2 }},
    { move: { x:  -4, y:  10 }},
    { line: { x: -10, y:  10 }},
    { move: { x:  -8, y:   6 }},
    { line: { x:  -8, y:   0 }},
    { line: { x: -12, y:  -4 }},
    { move: { x:   0, y:   8 }},
    { line: { x:  -4, y:   4 }},
    { move: { x:   0, y:   2 }},
    { line: { x: -10, y:  -8 }},
    { move: { x:   0, y:  -4 }},
    { line: { x:  -4, y:  -8 }},
    { line: { x:  -4, y: -10 }},
    { move: { x:   0, y:  12 }},
    { line: { x:   6, y:   6 }},
    { line: { x:  10, y:   6 }},
    { move: { x:   2, y:  10 }},
    { line: { x:   8, y:  10 }},
    { move: { x:   0, y:   6 }},
    { line: { x:  12, y:  -6 }},
    { move: { x:   8, y:  -2 }},
    { line: { x:   8, y:  -8 }},
    { move: { x:   4, y:   2 }},
    { line: { x:  12, y:   2 }},
    { move: { x:   0, y:   0 }},
    { line: { x:   4, y:  -4 }},
    { move: { x:   0, y:  -6 }},
    { line: { x:   4, y: -10 }},
  ];

  var trunkY = -options.height;
  Object.assign( options, {
    path: [ { y: 0 }, { y: trunkY - 26 } ],
    stroke: 0.5,
    color: color.deep,
  });
  var trunk = new Zdog.Shape( options );

  var canopy = new Zdog.Anchor({
    addTo: trunk,
    translate: { y: trunkY - 14 },
    rotate: { y: -TAU/8 },
  });

  var branchA = new Zdog.Shape({
    addTo: canopy,
    path: branchPath,
    closed: false,
    stroke: 0.6,
    color: color.deep,
  });

  branchA.copyGraph({
    rotate: { y: TAU/4 },
  });

  return trunk;
};

// ------------------------- init ------------------------- //

ZdogSpookyHouse.init = function( canvas ) {
  if (typeof Zdog === 'undefined') return;
  var TAU = Zdog.TAU;
  var color = ZdogSpookyHouse.color;

  // get closest whole number or half number value
  //   based on width & ratio of 270px == 1 zoom
  var zoom = Math.floor( canvas.width / 135 ) / 2;

  var illo = new Zdog.Illustration({
    element: canvas,
    zoom: zoom,
    rotate: { y: TAU/8 },
    dragRotate: true,
    onDragStart: function() {
      ZdogSpookyHouse.wobbling = false;
    },
  });

  var scene = new Zdog.Anchor({
    addTo: illo,
    translate: { y: ZdogSpookyHouse.sceneY },
  });

  // ----- centerIsland ----- //

  var centerIsland = new Zdog.Anchor({
    addTo: scene,
  });
  var centerIslandSize = 72;

  // island ground surface
  new Zdog.Rect({
    addTo: centerIsland,
    width: centerIslandSize,
    height: centerIslandSize,
    rotate: { x: TAU/4 },
    color: color.dark,
    stroke: 4,
    fill: true,
    backface: false,
  });

  ZdogSpookyHouse.getPyramid({
    addTo: centerIsland,
    scale: { x: centerIslandSize/2, y: -52, z: centerIslandSize/2 },
    translate: { y: 2 },
    color: color.darker,
  });

  ZdogSpookyHouse.getPyramid({ // spike
    addTo: centerIsland,
    scale: { x: 12, y: -28, z: 12 },
    translate: { x: -12, y: 18, z: 8 },
    color: color.darker,
    backface: false,
  });

  ZdogSpookyHouse.getPyramid({ // spike
    addTo: centerIsland,
    scale: { x: 8, y: -28, z: 8 },
    translate: { x: 8, y: 8, z: -22 },
    color: color.darker,
    backface: false,
  });

  ZdogSpookyHouse.getLeafTree({
    addTo: centerIsland,
    height: 3,
    translate: { x: -35, z: 3, },
  });

  var islandShard = new Zdog.Anchor({
    addTo: centerIsland,
    translate: { x: 20, y: 54, z: -16 },
    scale: { x: 4, y: -8, z: 4 },
  });

  ZdogSpookyHouse.getPyramid({ // shard top
    addTo: islandShard,
    scale: { y: -1 },
    color: color.deep,
  });

  ZdogSpookyHouse.getPyramid({ // shard bottom
    addTo: islandShard,
    color: color.deep,
  });

  // ------------------------- south island ------------------------- //

  var southIsland = new Zdog.Group({
    addTo: scene,
    translate: { x: 18, z: 80 },
    scale: ZdogSpookyHouse.hillScale,
    updateSort: true,
  });

  var southIslandBigShapeAnchor = new Zdog.Anchor({
    addTo: southIsland,
    scale: { x: 24, y: 32, z: 24 },
  });

  ZdogSpookyHouse.getPyramid({
    addTo: southIslandBigShapeAnchor,
    color: color.dark,
  });

  ZdogSpookyHouse.getPyramid({
    addTo: southIslandBigShapeAnchor,
    scale: { y: -1 },
    snub: true,
    color: color.deep,
  });

  ZdogSpookyHouse.getPyramid({ // bottom spike
    addTo: southIsland,
    scale: { x: 6, y: -14, z: 6 },
    translate: { x: -8, y: 12, z: 8 },
    color: color.deep,
  });

  ZdogSpookyHouse.getPyramid({ // top spike
    addTo: southIsland,
    scale: { x: 12, y: 46, z: 12 },
    translate: { x: -12, z: -4 },
    color: color.dark,
  });

  ZdogSpookyHouse.getConeTree({
    addTo: southIsland,
    diameter: 8,
    length: 10,
    translate: { x: 2, y: -15, z: 18 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: southIsland,
    diameter: 8,
    length: 10,
    translate: { x: 15, y: -8, z: 16 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: southIsland,
    diameter: 8,
    length: 10,
    translate: { x: 22, y: -3, z: 5 },
  });

  // ------------------------- north island ------------------------- //

  var northIslandTopColor = color.dark;
  var northIslandBottomColor = color.deep;

  var northIsland = new Zdog.Group({
    addTo: scene,
    translate: { x: -52, z: -64 },
    scale: ZdogSpookyHouse.hillScale,
    updateSort: true,
  });

  ZdogSpookyHouse.getPyramid({
    addTo: northIsland,
    scale: { x: 26, y: 60, z: 26 },
    color: northIslandTopColor,
  });

  ZdogSpookyHouse.getPyramid({ // top spike
    addTo: northIsland,
    scale: { x: 14, y: 52, z: 14 },
    translate: { x: 12, y: -2, z: -12 },
    color: northIslandTopColor,
  });

  ZdogSpookyHouse.getPyramid({ // bottom
    addTo: northIsland,
    scale: { x: 26, y: -26, z: 26 },
    color: northIslandBottomColor,
  });

  ZdogSpookyHouse.getPyramid({ // bottom spike
    addTo: northIsland,
    scale: { x: 10, y: -20, z: 10 },
    translate: { x: 12, y: 2, z: -12 },
    color: northIslandBottomColor,
  });

  ZdogSpookyHouse.getConeTree({
    addTo: northIsland,
    diameter: 8,
    length: 10,
    translate: { x: 18, y: -26, z: 0 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: northIsland,
    diameter: 8,
    length: 10,
    translate: { x: 32, y: -8, z: -4 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: northIsland,
    diameter: 8,
    length: 10,
    translate: { x: 10, y: -16, z: 24 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: northIsland,
    diameter: 8,
    length: 10,
    translate: { x: 0, y: -28, z: -22 },
  });

  // ------------------------- east island ------------------------- //

  var eastIsland = new Zdog.Group({
    addTo: scene,
    translate: { x: 76, z: 36 },
    scale: ZdogSpookyHouse.hillScale,
    updateSort: true,
  });

  var eastPyramidSide = 20;

  ZdogSpookyHouse.getPyramid({
    addTo: eastIsland,
    scale: { x: eastPyramidSide, y: 36, z: eastPyramidSide },
    color: color.dark,
  });

  ZdogSpookyHouse.getPyramid({
    addTo: eastIsland,
    scale: { x: eastPyramidSide, y: -24, z: eastPyramidSide },
    color: color.deep,
    snub: true,
  });

  ZdogSpookyHouse.getConeTree({
    addTo: eastIsland,
    diameter: 8,
    length: 10,
    translate: { x: 10, y: -10, z: 18 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: eastIsland,
    diameter: 8,
    length: 10,
    translate: { x: 16, y: -16 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: eastIsland,
    diameter: 8,
    length: 10,
    translate: { x: -14, y: -18, z: -10 },
  });

  islandShard.copyGraph({
    addTo: eastIsland,
    scale: { x: 4, y: -6, z: 4 },
    translate: { x: 0, y: 28, z: 2 },
  });

  // ------------------------- west island ------------------------- //

  var westIsland = new Zdog.Group({
    addTo: scene,
    translate: { x: -78, z: -36 },
    scale: ZdogSpookyHouse.hillScale,
    updateSort: true,
  });

  var westPyramidSide = 26;
  var westIslandTopColor = color.dark;
  var westIslandBottomColor = color.deep;

  ZdogSpookyHouse.getPyramid({
    addTo: westIsland,
    scale: { x: westPyramidSide, y: 42, z: westPyramidSide},
    color: westIslandTopColor,
  });

  ZdogSpookyHouse.getPyramid({
    addTo: westIsland,
    scale: { x: westPyramidSide, y: -40, z: westPyramidSide },
    color: westIslandBottomColor,
    snub: true,
  });

  ZdogSpookyHouse.getPyramid({ // top spike
    addTo: westIsland,
    scale: { x: 14, y: 29, z: 14 },
    translate: { x: 12, y: -2, z: -12 },
    color: westIslandTopColor,
  });

  ZdogSpookyHouse.getPyramid({ // top spike
    addTo: westIsland,
    scale: { x: 16, y: 54, z: 16 },
    translate: { x: -4, y: -2, z: -4 },
    color: westIslandTopColor,
  });

  ZdogSpookyHouse.getConeTree({
    addTo: westIsland,
    diameter: 8,
    length: 10,
    translate: { x: -16, y: -24, z: 6 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: westIsland,
    diameter: 8,
    length: 10,
    translate: { x: -22, y: -14, z: -16 },
  });

  ZdogSpookyHouse.getConeTree({
    addTo: westIsland,
    diameter: 8,
    length: 8,
    translate: { x: -22, y: -10, z: 15 },
  });

  var westIslandShard = new Zdog.Anchor({
    addTo: westIsland,
    scale: { x: 6, y: 9, z: 6 },
    translate: { x: 0, y: 40, z: 0 },
  });

  ZdogSpookyHouse.getPyramid({ // shard top
    addTo: westIslandShard,
    color: westIslandBottomColor,
  });

  ZdogSpookyHouse.getPyramid({ // shard bottom
    addTo: westIslandShard,
    scale: { y: -1.2 },
    color: westIslandBottomColor,
  });

  westIslandShard.copyGraph({
    scale: { x: 2, y: 4, z: 4 },
    translate: { x: 24, y: 29, z: -8 },
  });

  // ------------------------- graves ------------------------- //

  ZdogSpookyHouse.getGraveIsland({
    addTo: scene,
    translate: { x: 62, z: -32 },
  });

  ZdogSpookyHouse.getGraveIsland({
    addTo: scene,
    translate: { x: 60, z: -60 },
  });

  ZdogSpookyHouse.getGraveIsland({
    addTo: scene,
    translate: { x: 32, z: -64 },
  });

  // ------------------------- clouds ------------------------- //

  var cloudColor = color.darker;

  var cloudRotorA = new Zdog.Anchor({
    addTo: scene,
    translate: { y: -94 },
  });

  // big puff
  var bigCloudPuff = new Zdog.Shape({
    addTo: cloudRotorA,
    translate: { z: -64 },
    stroke: 32,
    scale: 2,
    color: cloudColor,
  });

  // left small puff
  var smallCloudPuff = new Zdog.Shape({
    addTo: bigCloudPuff,
    translate: { x: -9, y: 4, z: 4 },
    stroke: 16,
    color: cloudColor,
  });
  smallCloudPuff.copy({
    translate: { x: 9, y: 5, z: 6 },
    stroke: 20,
  });

  var disk = new Zdog.RoundedRect({
    addTo: bigCloudPuff,
    width: 26,
    height: 12,
    cornerRadius: 6,
    translate: { x: -6, y: 7, z: 4 },
    rotate: { x: TAU/4 },
    stroke: 6,
    color: cloudColor,
    fill: true,
  });
  disk.copy({
    translate: { x: 6, y: 9, z: 8 },
  });

  var cloudRotorB = new Zdog.Anchor({
    addTo: scene,
    translate: { y: -60 },
  });

  var bigCloudPuffB = new Zdog.Anchor({
    addTo: cloudRotorB,
    translate: { z: 88 },
  });

  new Zdog.Hemisphere({
    addTo: bigCloudPuffB,
    diameter: 36,
    rotate: { x: TAU/4 },
    color: cloudColor,
    stroke: 6,
  });

  bigCloudPuff.copy({
    addTo: bigCloudPuffB,
    translate: { x: 16, y: -14, z: -4 },
  });

  disk.copy({
    addTo: bigCloudPuffB,
    width: 28,
    height: 16,
    cornerRadius: 8,
    stroke: 10,
    scale: 2,
    translate: { x: 8, y: 2, z: 4 },
  });

  // ------------------------- content ------------------------- //

  var house = ZdogSpookyHouse.addHouse({
    addTo: centerIsland,
    stroke: 1/illo.zoom,
  });

  ZdogSpookyHouse.addCats({
    addTo: centerIsland,
  });

  ZdogSpookyHouse.addBones({
    addTo: centerIsland,
  });

  var interiorScene = ZdogSpookyHouse.addInteriorScene({
    addTo: house.shape,
    translate: { z: 6 },
  });

  var fogMonster = ZdogSpookyHouse.addFogMonster({
    addTo: scene,
    translate: { y: 12 },
  });

  var carRoad = ZdogSpookyHouse.addCarRoad({
    addTo: scene,
  });

  // ----- animate ----- //

  var ticker = 0;
  var cycleCount = 300;

  // Define easeInOut if it doesn't exist
  if (!Zdog.easeInOut) {
    Zdog.easeInOut = function( t ) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
  }

  function animate() {
    var progress = ticker / cycleCount;
    // update
    if ( ZdogSpookyHouse.wobbling & progress <= 2 ) {
      var theta = Zdog.easeInOut( progress % 1 ) * TAU;
      var delta = TAU * -3/64;
      illo.rotate.y = Math.sin( theta ) * delta + TAU/8;
      illo.rotate.x = ( Math.cos( theta ) * -0.5 + 0.5 ) * delta;
    }
    illo.normalizeRotate();
    fogMonster.animate( progress );
    carRoad.animate( progress );
    house.animate( progress, illo.rotate );
    interiorScene.animate( progress );
    cloudRotorA.rotate.y = progress * TAU/12;
    cloudRotorB.rotate.y = progress * TAU/16;
    // bob islands
    centerIsland.translate.y = Math.sin( progress/4 * TAU ) * 4;
    eastIsland.translate.y = Math.sin( progress/1.5 * TAU ) * -4;
    westIsland.translate.y = Math.sin( progress/2.5 * TAU ) * -4;
    northIsland.translate.y = Math.sin( progress/3 * TAU ) * 4;
    southIsland.translate.y = Math.sin( progress/2 * TAU ) * 4;

    ticker++;
    illo.updateRenderGraph();
    requestAnimationFrame( animate );
  }

  animate();

};

// Initialize when Events section is shown
(function() {
  var zdogCanvas = null;
  var isInitialized = false;
  var zdogIllo = null;

  function initZdog() {
    if (isInitialized) {
      console.log('Zdog already initialized');
      return;
    }
    
    // Wait for Zdog library to load
    if (typeof Zdog === 'undefined') {
      console.warn('Zdog library not loaded yet, waiting...');
      setTimeout(initZdog, 100);
      return;
    }
    
    zdogCanvas = document.querySelector('#events .zdog-canvas');
    if (!zdogCanvas) {
      console.warn('Canvas not found, waiting...');
      setTimeout(initZdog, 100);
      return;
    }
    
    // Make sure section is visible
    const eventsSection = document.getElementById('events');
    if (eventsSection && window.getComputedStyle(eventsSection).display === 'none') {
      console.warn('Events section is hidden, waiting...');
      setTimeout(initZdog, 100);
      return;
    }
    
    try {
      console.log('Initializing Zdog Spooky House...');
      console.log('Canvas element:', zdogCanvas);
      console.log('ZdogSpookyHouse.init:', typeof ZdogSpookyHouse.init);
      ZdogSpookyHouse.init(zdogCanvas);
      isInitialized = true;
      console.log('Zdog initialized successfully');
    } catch(e) {
      console.error('Error initializing Zdog:', e);
      console.error('Stack:', e.stack);
    }
  }

  // Expose init function globally - will be called when Events section is shown
  window.initZdogEvents = initZdog;
})();


