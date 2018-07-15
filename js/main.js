
let mySVG
  , wrapperSvg
  , fpl = {
        front:  null
      , widthFront: null
      , frontM: null
      , leg:    null
      , widthLeg: null
      , legM:   null    
    }
  , axisX = 1400
  , floor = 1200
  , axis = null    
  , ui = {
      inpFrontWidth: null
    }


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


const resizeFpl = ( id, v )  => {
  if ( id = 'scaleFront' ) scaleFront( v ) 
}


const scaleFront = v => {
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

  fpl.front.transform( { a: v, e: axisX  } )
  fpl.frontM.transform( { a: -v, e: axisX } ) 
  fpl.frontM.x( v )
  fpl.leg.x( axisX + fpl.widthFront*v  )   
  fpl.legM.x( -axisX + fpl.widthFront*v + fpl.widthLeg )   
 // fpl.front.transform( { scaleX: v } )
 // fpl.frontM.transform( { scaleX: v } )
}


const addSelectors = () => {
  let inp = document.createElement( 'input' )
  inp.type = 'range'
  inp.min = '35'
  inp.max = '70'
  inp.id = 'scaleFront'
  inp.style.zIndex = '100'
  inp.style.position = 'relative'
  inp.style.bottom = window.innerHeight/3 + 'px'//20px'
  inp.style.left = window.innerWidth/2 - 250 + 'px'
  inp.style.width = window.innerWidth/5  + 'px'  
  inp.value = '45'
  inp.onkeydown = 'return false'
  inp.oninput = e => resizeFpl( e.target.id, e.target.value/45 )	 
  wrapperSvg.appendChild( inp ) 
  ui.inpFrontWidth = inp
}


const resizeSelectors = () => {
  ui.inpFrontWidth.style.bottom = window.innerHeight/10 + 'px'//20px'
  ui.inpFrontWidth.style.left = window.innerWidth/2 - window.innerWidth/5  + 'px'  
  ui.inpFrontWidth.style.width = window.innerWidth/5  + 'px' 
}


window.onresize = () => { 
  resizeModel()
  resizeSelectors()
}   
