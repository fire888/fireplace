

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
  pointScale:   'leftBottom', // || 'center' || buttomCenter 
  rotation:     0,
  pX:           0,
  pY:           0
},
flame = {
  model: null,
  props: null
},
axisX = 1200,
floor = 215,
svg,  
appWrapper,  
uiWrapper   


/*****************************************************************************/

SVG.on( document, 'DOMContentLoaded', () => {
  prepearWindow() 
  initSvg() 
  drawShtamp()
  drawFlame()       
  drawFireplace()
  drawUiElems()

  //test_drawElem()
  //test_drawUi()

  resizeWindow()
})


const initSvg = () => {
  mySVG = SVG( 'model' )
  mySVG.attr({ 
      id: "mySVG"
    , 'vector-effect' : 'non-scaling-stroke'
  })
  mySVG.viewbox(0, 0, 2970, 2100)
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
  let polylineframe = mySVG.polygon( '2,2    2968,2   2968,2098   2,2098')
   .attr({ 
      fill: 'none'
    , stroke: '#d0db7d'
    , 'stroke-width': 1
    , 'vector-effect': 'non-scaling-stroke'
  })  
}


const drawFireplace = () => {
  frontView.model = mySVG.group()
  frontView.props = Object.assign( {}, proto_Props )  
  transformObj( frontView, 'pointScale', 'centerBottom' )
  transformObj( frontView, 'pX', axisX )
  transformObj( frontView, 'pY', floor )

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

const drawFlame = () => {
  flame.model = mySVG.rect(700, 550)
  flame.props = Object.assign( {}, proto_Props ) 
  flame.model.attr({ 
    fill: '#27242d',
    stroke: '#edda5c',
    'stroke-width': 1,
    'vector-effect': 'non-scaling-stroke'
  })
  transformObj( flame, 'pointScale', 'centerBottom' )  
  transformObj( flame, 'pX', axisX - 350 )
  transformObj( flame, 'pY', floor + 300 )  
}


/*****************************************************************************/

const transformObj = ( obj, prop, val ) => {
  let m = obj.model
    , p = obj.props
    , pScaleX
    , pScaleY
    
  if ( p.pointScale == "center" ) { 
    pScaleX = m.bbox().cx
    pScaleY = m.bbox().cy  
  } 
  if ( p.pointScale == "leftBottom" ) { 
    pScaleX = p.pX
    pScaleY = p.pY
  }
  if ( p.pointScale == "centerBottom" ) { 
      pScaleX = m.bbox().cx
      pScaleY = m.bbox().h 
  }  

  m.transform( { scaleY: 1, cx: pScaleX, cy: pScaleY } )
   .transform( { scaleX: 1*p.flip, cx: pScaleX, cy: pScaleY }, true )
   .rotate( 0, p.pX, p.pY + m.bbox().h )  
   .move( 0, 0 )  
  
  if ( typeof val == 'string' ) 
    eval( 'obj.props.' + prop + ' = ' + '"' + val + '"' ) 
  if ( typeof val == 'number' ) 
    eval( 'obj.props.' + prop + ' = ' + val ) 

  m.move( p.pX, p.pY )   
   .rotate( p.rotation, p.pX, p.pY + m.bbox().h )
   .transform( { scaleX: p.scaleX*p.flip, cx: pScaleX, cy: pScaleY } ) 
   .transform( { scaleY: p.scaleY, cx: pScaleX, cy: pScaleY }, true ) 
}


/*****************************************************************************/

const drawUiElems = () => {
  createBlock( 'flame', ( parent ) => {
    createSelector({
        id: 'width'
      , min: 2
      , max: 200
      , value: 100  
      , oninput: e => transformObj( flame, 'scaleX', e.target.value/100 )     
    }, parent )
    , createSelector({
        id: 'height'
      , min: 2
      , max: 200  
      , value: 100
      , oninput: e => transformObj( flame, 'scaleY', e.target.value/100 )     
    }, parent )
    , createSelector({
        id: 'heightUnderFloor'
      , min: -100
      , max: 300
      , value: 0
      , oninput: e => { 
          flame.model.y( flame.props.pY - ( +e.target.value ) ) // !mistake
        }
      }, parent )    
  })  
  createBlock( 'front View', ( parent ) => {
    createSelector({
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


const prepearWindow = () => {

  appWrapper = document.getElementById( 'app' )

  uiWrapper = document.createElement( 'div' )
  uiWrapper.id = 'uiWrapper'
  appWrapper.appendChild( uiWrapper )  
}


const resizeWindow = () => {
  let w = window.innerWidth
  let h = window.innerHeight
  appWrapper.style.width = w + 'px'
  appWrapper.style.height = h + 15 + 'px'  

  if ( w/h > 2.3 ) { 
    uiWrapper.style.flexDirection = 'row'      
  }else{
    uiWrapper.style.flexDirection = 'column'     
  } 

  if ( w/h > 1.7 ) { 
    wSvg = ( h - 20 )*1.415 - 3 
    hSvg = h - 20 - 3 
    appWrapper.style.flexDirection = 'row'
    uiWrapper.style.height = hSvg + 'px' 
    uiWrapper.style.width = w - wSvg - 3 + 'px' 
    mySVG.attr({ 
        width: wSvg
      , height: hSvg
    })        
  }
  if ( w/h > 1.2 && w/h < 1.7 ) { 
    wSvg = w-20
    hSvg = (w-20)*0.7 
    appWrapper.style.flexDirection = 'row'
    uiWrapper.style.height = hSvg + 'px' 
    uiWrapper.style.width = w - wSvg - 3 + 'px'     
    mySVG.attr({ 
        width: wSvg * 0.85
      , height: hSvg * 0.85
    })        
  }      
  if ( w/h < 1 ) {  
    wSvg = w - 20
    hSvg = (w - 20)*0.7      
    appWrapper.style.flexDirection = 'column'
    uiWrapper.style.width = wSvg - 3  + 'px'
    uiWrapper.style.height = h - hSvg -3  + 'px'    
    mySVG.attr({ 
        width: wSvg
      , height: hSvg
  }) 
  }     
} 


const createBlock = ( str, addElems ) => {
  let newElem = document.createElement( 'div' )
  newElem.style.margin = '5px'
  newElem.style.padding = '0px'      
  newElem.style.color = '#766c44'  
  newElem.style.backgroundColor = '#1c1c1e'  
  newElem.style.borderRadius = '5px' 
  newElem.style.overflow = 'hidden'
  newElem.class = 'uiblock'
  newElem.style.flex = '1 0 auto'
  uiWrapper.appendChild( newElem )   

  let head = document.createElement( 'div' )
  str ? head.innerHTML = str :  head.innerHTML = ' ' 
  head.style.backgroundColor = "#27242d"
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
    , margin = '5px'
    , width = '70%'  
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
  newElem.style.margin = margin
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
      , margin= '2px'
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
  newElem.style.margin= margin
  newElem.style.width = width
  newElem.value = value
  newElem.onkeydown = onkeydown
  newElem.oninput = oninput
  newElem.onclick = onclick
  parent.appendChild( newElem ) 
  return newElem
}



/*****************************************************************************/

window.onresize = () => resizeWindow()

























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

