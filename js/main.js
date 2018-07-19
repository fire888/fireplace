

let mySVG, 
frontView = {
  model: null,
  props: null
},  
f = {  
  frontR: {
    model: null,
    props: null 
  },
  frontL: {
    model: null,
    props: null 
  },       
  legR: { 
    model: null,
    props: null 
  },
  legL: { 
    model: null,
    props: null, 
  }      
},
proto_Props = {
  flip:         1,
  scaleX:       1,
  scaleY:       1,
  pointScale:   'bottomLeft', // || 'center' 
  rotation:     0,
  pX:           0,
  pY:           0
},
svg,  
appWrapper,  
uiWrapper   


/*****************************************************************************/

SVG.on( document, 'DOMContentLoaded', () => {
  prepearWindow() 
  initSvg() 
  resizeSvg()
  drawShtamp()    
  drawFireplace()
  drawUiElems()

  test_drawElem()
  test_drawUi()
})

const prepearWindow = () => {
  document.body.style.margin = 0
  document.body.style.padding = 0 
  document.body.style.backgroundColor = '#000000'

  appWrapper = document.getElementById( 'app' )

  svgWrapper = document.getElementById( 'wrapperFireplaceModel' ) 
  svgWrapper.style.display = 'inline-block'
  svgWrapper.style.float = 'left'
  
  svg = document.getElementById( 'model' )
  svg.style.width = 'auto' 
  svg.style.height = '70%'   
} 

const initSvg = () => {
  mySVG = SVG( 'model' )
  mySVG.attr({ 
      id: "mySVG"
    , 'vector-effect' : 'non-scaling-stroke'
  })
  mySVG.style.display = 'inline' 
  mySVG.viewbox(0, 0, 2970, 2100)
}

const resizeSvg = () => { 
  let w = window.innerWidth
  let h = window.innerHeight
  let sv, sh 

  if ( w/h > 1.6 ) {
    sw = window.innerHeight*1.4
    sh = window.innerHeight 
    console.log( 'gor' )
  }  
  if (  w/h > 1 && w/h < 1.6 ) {
    sw = window.innerWidth*0.7
    sh = sw*0.7  
    console.log( 'another' )
  } 
  if ( w/h < 1 ) {
    sw = window.innerWidth
    sh = sw*0.7  
    console.log( 'vert' )
  } 
  mySVG.attr({ 
     width: sw
   , height: sh
  })
}


/*****************************************************************************/

const drawShtamp = () => { 
  let polyline = mySVG.polygon( '200,50    2920,50   2920,2050   200,2050')
   .attr({ 
      fill: 'none'
    , stroke: '#d0db7d'
    , 'stroke-width': 1
    , 'vector-effect': 'non-scaling-stroke'
  })
  //axis = mySVG.line( axisX, floor-15, axisX, floor+15 ).stroke({ width: 1 })
}


const drawFireplace = () => {
  frontView.model = mySVG.group()
  frontView.props = Object.assign( {}, proto_Props )  
  transformObj( frontView, 'pointScale', 'center' )
  transformObj( frontView, 'pX', 1200 )
  transformObj( frontView, 'pY', 800 )

  let frontDef = SVG.select( '#front' )
  frontModelDef = frontDef // test geom
  
  f.frontR.model = frontView.model.use( frontDef.members[ 0 ] )
  f.frontR.props = Object.assign( {}, proto_Props )

  f.frontL.model = frontView.model.use( frontDef.members[ 0 ] )
  f.frontL.props = Object.assign( {}, proto_Props )  
  transformObj( f.frontL, 'flip', -1 )  

  let legDef = SVG.select( '#leg' )
  
  f.legR.model = frontView.model.use( legDef.members[ 0 ] ) 
  f.legR.props = Object.assign( {}, proto_Props )      
  transformObj( f.legR, 'pX', f.frontR.model.bbox().w )

  f.legL.model = frontView.model.use( legDef.members[ 0 ] ) 
  f.legL.props = Object.assign( {}, proto_Props )
  transformObj( f.legL, 'flip', -1 )  
  transformObj( f.legL, 'pX', f.frontL.model.bbox().w )   
} 


/*****************************************************************************/

const transformObj = ( obj, prop, val ) => {
  let m = obj.model
    , p = obj.props
    , pScaleX
    , pScaleY
    
  if ( p.pointScale == "center" ) { pScaleX = pScaleY = false } 
  if ( p.pointScale == "bottomLeft" ) { 
     pScaleX = p.pX
     pScaleY = p.pY
  } 

  m.transform( { scaleY: 1, cx: pScaleX, cy: pScaleY + m.bbox().h  } )
   .transform( { scaleX: 1*p.flip, cx: pScaleX, cy: pScaleY }, true )
   .rotate( 0, p.pX, p.pY + m.bbox().h )  
   .move( 0, 0 )  
  
  if ( typeof val == 'string' ) 
    eval( 'obj.props.' + prop + ' = ' + '"' +  val + '"' ) 
   if ( typeof val == 'number' ) 
    eval( 'obj.props.' + prop + ' = ' + val  ) 

   m.move( p.pX, p.pY )   
    .rotate( p.rotation, p.pX, p.pY + m.bbox().h )
    .transform( { scaleX: p.scaleX*p.flip, cx: pScaleX, cy: pScaleY } ) 
    .transform( { scaleY: p.scaleY, cx: pScaleX, cy: pScaleY + m.bbox().h }, true ) 
}


/*****************************************************************************/

const drawUiElems = () => {   
  createBlock( 'front View', ( parent ) => {
    createSelector({
        id: 'moveFrontViewX'
      , min: 0
      , max: 2950    
    , oninput: e => transformObj( frontView, 'pX', e.target.value )     
    }, parent )
    , createSelector({
        id: 'moveFrontViewY'
      , min: 0
      , max: 2100  
    , oninput: e => transformObj( frontView, 'pY', e.target.value )      
    }, parent )
    , createSelector({
        id: 'scaleViewFront'
      , min: 2
      , max: 200  
      , value: 100      
      , oninput: e => transformObj( frontView, 'scaleX', e.target.value/100 )      
    }, parent )  
    , createSelector({
        id: 'changeHeight'
      , min: 2
      , max: 200
      , value: 100    
      , oninput: e => transformObj( frontView, 'scaleY', e.target.value/100 )          
    }, parent )
  })

  createBlock( 'mainElement', ( parent ) => {               
    createSelector({
        id: 'changeMainWidth'
      , min: 2
      , max: 200
      , value: 100
      , oninput: e => {
          transformObj( f.frontR, 'scaleX', e.target.value/100 )
          transformObj( f.frontL, 'scaleX', e.target.value/100 )
          transformObj( f.legR, 'pX', e.target.value/100*f.frontR.model.bbox().w )
          transformObj( f.legL, 'pX', e.target.value/100*f.frontL.model.bbox().w )  
        }          
    }, parent )
  })       
}


const createBlock = ( str, addElems ) => {
  let newElem = document.createElement( 'div' )
  newElem.style.display = 'inline-block'
  newElem.style.float = 'left'
  newElem.style.margin = '5px'
  newElem.style.padding.top = '0px'   
  newElem.style.color = '#bcb26d'  
  newElem.style.backgroundColor = '#6b3a28'  
  newElem.style.borderRadius = '5px' 
  newElem.style.overflow = 'hidden'
  appWrapper.appendChild( newElem )   

  let head = document.createElement( 'div' )
  str ? head.innerHTML = str :  head.innerHTML = ' ' 
  head.style.backgroundColor = "#a89c4e"
  head.style.color = '#5f5d4d' 
  head.style.paddingLeft = '15px'  
  head.style.marginBottom = '5px'    
  newElem.appendChild( head )
  
  addElems( newElem )      
}


const createSelector = ( props, parent ) => {
  let {
      type = 'range'
    , min = -50
    , max = 50
    , value = 0
    , id = 'scaleFront'
    , zIndex = '100'
    , position = 'relative'
    , display = 'block'
    , marginBottom = '2px'
    , left = '0px'
    , width = '90%'  
    , onkeydown = 'return false'
    , oninput = () => {}  	  
  } = props
  
  let inpName = document.createElement( 'p' )
  inpName.innerHTML = id
  inpName.style.margin = '0px'
  inpName.style.marginLeft = '15px'
  parent.appendChild( inpName )   

  let newElem = document.createElement( 'input' )
  newElem.type = type
  newElem.id = id
  newElem.style.zIndex = zIndex
  newElem.style.position = position
  newElem.style.display = display
  newElem.style.marginBottom = marginBottom
  newElem.style.left = left
  newElem.style.width = width
  newElem.min = min
  newElem.max = max  
  newElem.value = value
  newElem.onkeydown = onkeydown
  newElem.oninput = oninput	 
  parent.appendChild( newElem ) 
  return newElem
}


const createButton = ( props, parent ) => {
  let {
        id = 'flip'
      , zIndex = '100'
      , position = 'relative'
      , display = 'block'
      , marginBottom = '2px'
      , left = '0px' 
      , width = '100px'
      , value = null
      , onkeydown = null
      , oninput = null
      , onclick = () => {}  
  } = props

  let newElem = document.createElement( 'button' )
  newElem.id = id
  newElem.innerHTML = id
  newElem.style.zIndex = zIndex
  newElem.style.position = position
  newElem.style.display = display
  newElem.style.marginBottom = marginBottom
  newElem.style.left = left
  newElem.style.width = width
  newElem.value = value
  newElem.onkeydown = onkeydown
  newElem.oninput = oninput
  newElem.onclick = onclick
  parent.appendChild( newElem ) 
  return newElem
}

const resizeUi = () => {}


/*****************************************************************************/

window.onresize = () => { 
  console.log('!')
  resizeSvg()
  resizeUi()
}   
























// TRESH
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/

// Test Vars
let frontModelDef,
testModel,
testModeldata = {
  flip:       1,
  scaleX:     1,
  scaleY:     1,
  rotation:   0,
  pX:         0,
  pY:         0  
}


/*****************************************************************************/

const test_drawElem = () => {
  testModel = mySVG.use( frontModelDef.members[ 0 ] ) 
}


/*****************************************************************************/

const transformTest = changeAttr => {
  testModel.transform( { scaleY: 1, cx: testModeldata.pX, cy: testModeldata.pY +  testModel.bbox().h  } )
           .transform( { scaleX: 1 * testModeldata.flip, cx: testModeldata.pX, cy: testModeldata.pY }, true )
           .rotate( 0, testModeldata.pX, testModeldata.pY + testModel.bbox().h  )  
           .move( 0, 0 )  
  changeAttr()
  testModel.move( testModeldata.pX, testModeldata.pY )   
           .rotate( testModeldata.rotation, testModeldata.pX, testModeldata.pY + testModel.bbox().h )
           .transform( { scaleX: testModeldata.scaleX * testModeldata.flip, cx: testModeldata.pX, cy: testModeldata.pY } ) 
           .transform( { scaleY: testModeldata.scaleY, cx: testModeldata.pX, cy: testModeldata.pY + testModel.bbox().h }, true )      
}


const setSize = v => testModel.size(v*1000, 300)


const testFlip = v => testModeldata.flip = -1


const testUnFlip = v => testModeldata.flip = 1


const testMoveX = v => testModeldata.pX = v*1000


const testMoveY = v => testModeldata.pY = v*1000


const testRotate = v => testModeldata.rotation = v*360


const testScaleX = v => {
  v = Math.abs( v*5 )
  v < 0.01 ? v = 0.01 : v
  testModeldata.scaleX = v
}


const testScaleY = v => {
  v = Math.abs( v*5 )
  v < 0.01 ? v = 0.01 : v
  testModeldata.scaleY = v
}

/*****************************************************************************/


const test_drawUi = () => {
  createBlock ( 'test Element', ( parent ) => { 
  createButton({
      id: 'testFlip'
    , onclick: e =>  transformTest( () => testFlip() )   
  }, parent ),
  createButton({
      id: 'testUnFlip'
    , onclick: e =>  transformTest( () => testUnFlip() )  
  }, parent ) ,   
  createSelector({
      id: 'testMoveX'
    , oninput: e => transformTest( () => testMoveX( e.target.value/50 )	)     
  }, parent ),  
  createSelector({
      id: 'testMoveY'
    , oninput: e => transformTest( () => testMoveY( e.target.value/50 ) )     
  }, parent ),   
  createSelector({
      id: 'testRotate'
    , oninput: e => transformTest( () => testRotate( e.target.value/50 ) )
  }, parent ),  
  createSelector({
      id: 'testScaleX'
    , oninput: e => transformTest( () => testScaleX( e.target.value/50 ) )
  }, parent ),   
  createSelector({
      id: 'testScaleY'
    , oninput: e => transformTest( () => testScaleY( e.target.value/50 ) )	 
  }, parent )
  })
}

