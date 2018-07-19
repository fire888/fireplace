

let mySVG
  , axisX =        1400
  , floor =        1200
  , axis  =        null
  , frontView = {
        model:   null
      , props:   null
    }  
  , f = {  
      frontR: {
          model:   null
        , props:   null 
      }
      , frontL: {
          model:   null
        , props:   null 
      }       
      , legR: { 
          model:   null
        , props:   null 
      }
      , legL: { 
          model:   null
        , props:   null 
      }      
    }
  , proto_Props = {
      flip:       1
    , scaleX:     1
    , scaleY:     1
    , pointScale: 'bottomLeft' // || 'center' 
    , rotation:   0
    , pX:         0
    , pY:         0
  }   
  , testModel
  , testModeldata = {
        flip:       1
      , scaleX:     1
      , scaleY:     1
      , rotation:   0
      , pX:         0
      , pY:         0  
    }
  , uiWrapper 


/*****************************************************************************/

SVG.on( document, 'DOMContentLoaded', () => {
  initSvg() 
  resizeSvg()
  drawShtamp()    
  drawFireplace()
  createUiWrapper()
  drawUiElems()
})


const initSvg = () => {
  document.body.style.margin = 0
  document.body.style.padding = 0
  document.body.style.overflow = 'hidden' 
  document.body.style.backgroundColor = '#eeeeff'
  mySVG = SVG( 'model' )
  mySVG.attr({ 
      id: "mySVG"
    , width: window.innerWidth
    , height: window.innerHeight
    , 'vector-effect' : 'non-scaling-stroke'
  })
  mySVG.style.display = 'inline' 
  mySVG.viewbox(0, 0, 2970, 2100)
}

const resizeSvg = () => { 
  mySVG.attr({ 
      width: window.innerWidth
    , height: window.innerHeight
  })
}


/*****************************************************************************/

const drawShtamp = () => { 
  let polyline = mySVG.polygon( '200,50    2920,50   2920,2050   200,2050')
   .attr({ 
      fill: 'none'
    , stroke: '#000'
    , 'stroke-width': 1
    , 'vector-effect': 'non-scaling-stroke'
  })
  axis = mySVG.line( axisX, floor-15, axisX, floor+15 ).stroke({ width: 1 })
}


const drawFireplace = () => {
  frontView.model = mySVG.group()
  frontView.props = Object.assign( {}, proto_Props )  
  transformObj( frontView, 'pointScale', 'center' )
  transformObj( frontView, 'pX', 1200 )
  transformObj( frontView, 'pY', 800 )

  let frontDef = SVG.select( '#front' )
  
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
  
  testModel = mySVG.use( frontDef.members[ 0 ] ) 
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

const createUiWrapper = () => {
  uiWrapper = document.createElement( 'div' )
  uiWrapper.id = 'uiWrapper'
  uiWrapper.style.position = 'absolute'
  uiWrapper.style.zIndex = '300'
  uiWrapper.style.bottom = '50px'
  uiWrapper.style.right = '30px' 
  uiWrapper.style.backgroundColor = '#aaaaaa' 
  uiWrapper.style.color = '#ffffff' 
  uiWrapper.style.overflow = 'hidden'
  document.body.appendChild( uiWrapper )
} 


const drawUiElems = () => {   
  createSeparator( 'test Element' ) 
  createButton({
      id: 'testFlip'
    , onclick: e =>  transformTest( () => testFlip() )   
  })
  createButton({
      id: 'testUnFlip'
    , onclick: e =>  transformTest( () => testUnFlip() )  
  })    
  createSelector({
      id: 'testMoveX'
    , oninput: e => transformTest( () => testMoveX( e.target.value/50 )	)     
  })  
  createSelector({
      id: 'testMoveY'
    , oninput: e => transformTest( () => testMoveY( e.target.value/50 ) )     
  })   
  createSelector({
      id: 'testRotate'
    , oninput: e => transformTest( () => testRotate( e.target.value/50 ) )
  })  
  createSelector({
      id: 'testScaleX'
    , oninput: e => transformTest( () => testScaleX( e.target.value/50 ) )
  })   
  createSelector({
      id: 'testScaleY'
    , oninput: e => transformTest( () => testScaleY( e.target.value/50 ) )	 
  })
  createSeparator( 'front Group' )
  createSelector({
      id: 'moveFrontViewX'
    , min: 0
    , max: 2950    
  , oninput: e => transformObj( frontView, 'pX', e.target.value )     
  })
  createSelector({
      id: 'moveFrontViewY'
    , min: 0
    , max: 2100  
  , oninput: e => transformObj( frontView, 'pY', e.target.value )      
  })
  createSelector({
      id: 'scaleViewFront'
    , min: 2
    , max: 200  
    , value: 100      
    , oninput: e => transformObj( frontView, 'scaleX', e.target.value/100 )      
  })  
  createSelector({
      id: 'changeHeight'
    , min: 2
    , max: 200
    , value: 100    
    , oninput: e => transformObj( frontView, 'scaleY', e.target.value/100 )          
  })     
  createSeparator( 'mainElement' )               
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
  })       
}


const createSelector = props => {
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
    , width = window.innerWidth/5  + 'px'  
    , onkeydown = 'return false'
    , oninput = () => {}  	  
  } = props
  
  let inpName = document.createElement( 'p' )
  inpName.innerHTML = id
  inpName.style.margin = '0px'
  inpName.style.marginLeft = '15px'
  uiWrapper.appendChild( inpName )   

  let inp = document.createElement( 'input' )
  inp.type = type
  inp.id = id
  inp.style.zIndex = zIndex
  inp.style.position = position
  inp.style.display = display
  inp.style.marginBottom = marginBottom
  inp.style.left = left
  inp.style.width = width
  inp.min = min
  inp.max = max  
  inp.value = value
  inp.onkeydown = onkeydown
  inp.oninput = oninput	 
  uiWrapper.appendChild( inp ) 
  return inp
}


const createButton = props => {
  let {
        id = 'flip'
      , zIndex = '100'
      , position = 'relative'
      , display = 'inline'
      , marginBottom = '2px'
      , left = '0px' 
      , width = '100px'
      , value = null
      , onkeydown = null
      , oninput = null
      , onclick = () => {}  
  } = props

  let inp = document.createElement( 'button' )
  inp.id = id
  inp.innerHTML = id
  inp.style.zIndex = zIndex
  inp.style.position = position
  inp.style.display = display
  inp.style.marginBottom = marginBottom
  inp.style.left = left
  inp.style.width = width
  inp.value = value
  inp.onkeydown = onkeydown
  inp.oninput = oninput
  inp.onclick = onclick
  uiWrapper.appendChild( inp ) 
  return inp
}


const createSeparator = v => {
  let inp = document.createElement( 'div' )
  inp.style.width = '100%'
  inp.style.height = '20px'
  inp.style.color = '#999999'  
  inp.style.backgroundColor= '#ffffff' 
  inp.style.paddingLeft= '15px' 
  v ? inp.innerHTML = v :  inp.innerHTML = ' ' 
  uiWrapper.appendChild( inp )     
}

const resizeUi = () => {}


/*****************************************************************************/

window.onresize = () => { 
  resizeSvg()
  resizeUi()
}   
