

/** VARS ***********************************************************/

let mySVG
  , wrapperSvg
  , fpl = {
        front:      null
      , widthFront: null
      , frontM:     null
      , leg:        null
      , widthLeg:   null
      , legM:       null    
    }
  , axisX = 1400
  , floor = 1200
  , axis = null    
  , ui = {
        inpFrontWidth: null
	  , inpMainHeight: null
    }


/** INIT ***********************************************************/	

SVG.on(document, 'DOMContentLoaded', function() {
  loadModel() 
  resizeModel()
  drawShtamp()    
  drawFpl()
  addSelectors()
})


const loadModel = () => {
  document.body.style.margin = 0
  document.body.style.padding = 0
  document.body.style.overflow = 'hidden' 
  document.body.style.backgroundColor = '#eeeeff'
  wrapperSvg = document.getElementById( 'wrapperFireplaceModel' )
  mySVG = SVG( 'model' )
  mySVG.attr({ 
      id: "mySVG"
    , width: window.innerWidth
    , height: window.innerHeight
    , 'vector-effect' : 'non-scaling-stroke'
  }) 
  mySVG.viewbox(0, 0, 2970, 2100)
}


const resizeModel = () => { 
  mySVG.attr({ 
      width: window.innerWidth
    , height: window.innerHeight
  })
}


/** DRAW ELEMS *****************************************************/

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

const drawFpl = () => {
  let legDef = SVG.select( '#leg' )
  let leg = mySVG.use( legDef.members[ 0 ] ) 
  let legM = mySVG.use( legDef.members[ 0 ] ) 
  legM.flip( 'x' )      

  let frontDef = SVG.select( '#front' )
  let front = mySVG.use( frontDef.members[ 0 ] ) 
  let frontM = mySVG.use( frontDef.members[ 0 ] ) 
  frontM.flip( 'x' )   

  let frontOffsetX = front.bbox().x
  let frontWidth = front.bbox().w
  fpl.widthFront = front.bbox().w 
  let height = front.bbox().h 

  front.transform( { a: 1,e: axisX } )
  //front.x( -frontOffsetX + axisX  ) 
  front.y( floor - height  )  
  frontM.x( -axisX + frontOffsetX + frontWidth )
  frontM.y( floor - height  )

  let legOffsetX = leg.bbox().x
  let legWidth = leg.bbox().w
  fpl.widthLeg = leg.bbox().w

  leg.x( - legOffsetX + frontWidth + axisX )
  leg.y( floor - height  )
  legM.x( -axisX+ legOffsetX + legWidth + frontWidth )
  legM.y( floor - height  )
  
  fpl.front = front 
  fpl.leg = leg
  fpl.frontM = frontM
  fpl.legM = legM
} 


/** TRANSFORMATIONS ************************************************/
  //sx sy - ось
  //"matrix(sx, 0, 0, sy, cx-sx*cx, cy-sy*cy)"
  
  // матрица трансформаций
  // a c e
  // b d f
  // 0 0 1

  // масштаб  
  // x 0 aX  
  // 0 y aY
  // 0 0 1

const resizeFpl = ( id, v ) => {
  if ( id == 'scaleFront' ) scaleFront( v )
  if ( id == 'scaleHeight' ) scaleHeight( v ) 	  
}


const scaleFront = v => {
  fpl.front.transform( { a: v, e: axisX  } )
  fpl.frontM.transform( { a: -v, e: axisX } ) 
  fpl.frontM.x( v )
  fpl.leg.x( axisX + fpl.widthFront*v  )   
  fpl.legM.x( -axisX + fpl.widthFront*v + fpl.widthLeg )   
}


const scaleHeight = v => {	
  fpl.front.scale( 1, v )
  fpl.frontM.scale( 1, v )
  fpl.leg.scale( 1, v )
  fpl.legM.scale( 1, v )  
}


/** DRAW UI ********************************************************/

const addSelectors = () => {
  let inpFrontWidth = {
      type: 'range'
    , min:  '35'
    , max:  '70'
    , id: 'scaleFront'
    , zIndex: '100'
    , position: 'relative'
	, display: 'block'
    , bottom: window.innerHeight/3 + 'px'
    , left: window.innerWidth/2 - 250 + 'px'
    , width: window.innerWidth/5  + 'px'  
    , value: '45'
    , onkeydown:'return false'
    , oninput: e => resizeFpl( e.target.id, e.target.value/45 )	  	  
  }	
  ui.inpFrontWidth =createSelector( inpFrontWidth ) 
  
  let inpMainHeight = {
      id: 'scaleHeight'
    , bottom: window.innerHeight/3 - 50 + 'px'	
  }
  let merge = Object.assign( inpFrontWidth, inpMainHeight )  
  ui.inpMainHeight = createSelector( merge ) 
}


const createSelector = v => {
  let inp = document.createElement( 'input' )
  inp.type = v.type
  inp.min = v.min
  inp.max = v.max
  inp.id = v.id
  inp.style.zIndex = v.zIndex
  inp.style.position = v.position
  inp.style.display = v.display
  inp.style.bottom = v.bottom
  inp.style.left = v.left
  inp.style.width = v.width
  inp.value = v.value
  inp.onkeydown = v.onkeydown
  inp.oninput = v.oninput	 
  wrapperSvg.appendChild( inp ) 
  return inp
}


const resizeSelectors = () => {
  ui.inpFrontWidth.style.bottom = window.innerHeight/10 + 'px'
  ui.inpFrontWidth.style.left = window.innerWidth/2 - window.innerWidth/5  + 'px'  
  ui.inpFrontWidth.style.width = window.innerWidth/5  + 'px'
  
  ui.inpMainHeight.style.bottom = window.innerHeight/10 - 50 + 'px'
  ui.inpMainHeight.style.left = window.innerWidth/2 - window.innerWidth/5  + 'px'  
  ui.inpMainHeight.style.width = window.innerWidth/5  + 'px'  
}


window.onresize = () => { 
  resizeModel()
  resizeSelectors()
}   
