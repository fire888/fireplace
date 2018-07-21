

let mySVG, 
frontView = {
  model: null,
  props: null
},
leftView = {
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
fL = {
  legR: {
    model: null,
    props: null 
  },    
  panel: { 
    model: null,
    props: null, 
  }    
},
proto_Props = {
  flip:         1,
  scaleX:       1,
  scaleXsaved:  1, 
  scaleY:       1,
  scaleYsaved:  1, 
  pointScale:   'leftBottom', // || 'center' || buttomCenter || rightCenter
  rotation:     0,
  pX:           0,
  pY:           0,
  outlineX:     0,
  outlineY:     0
},
flame = {
  model: null,
  props: null
},
axisX = 1200,
floor = 450,
svgW, svgH,
appWrapper,  
uiWrapper   


/*****************************************************************************/

SVG.on( document, 'DOMContentLoaded', () => {
  prepearWindow() 
  initSvg() 
  drawShtamp()
  drawFlame()       
  drawFireplace()
  drawDimentions()
  drawUiElems()
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
    , 'stroke-width': 1
    , 'vector-effect': 'non-scaling-stroke'
  })
  polyline.addClass( 'cls-1')
  let polylineframe = mySVG.polygon( '2,2    2968,2   2968,2098   2,2098')
   .attr({ 
      fill: 'none'
    , 'stroke-width': 1
    , 'vector-effect': 'non-scaling-stroke'
  })  
  polylineframe.addClass( 'cls-1')
  let r = mySVG.polygon( '2920,1930  1800,1930  1800,2050  2000,2050 2000,1930  ' ) 
    .attr({ 
      fill: 'none'
    , 'stroke-width': 1
    , 'vector-effect': 'non-scaling-stroke'
  })
  r.addClass( 'cls-1')
  let text = mySVG.text(function(add) {
    add.tspan('ArtMarbleStudio.ru ').newLine()
    add.tspan('MODEL: ').newLine()
    add.tspan(' Brattechinelly.  #0012x65')
  })
  text.font({
    family:   'roboto'
  , size:     30
  , anchor:   'left'
  , leading:  '1.5em'
  , fill: '#737373'
  })
  text.move( 2010,1940 ) 

  now = new Date();
  let text1 = mySVG.text(function(add) {
    add.tspan(  now.getDay() + '.' + now.getMonth() +'.'+ now.getFullYear() ).newLine() 
    add.tspan('c: ' + Math.floor( Math.random()*1000000 )).newLine()
  })
  text1.font({
    family:   'roboto'
  , size:     30
  , anchor:   'left'
  , leading:  '1.5em'
  , fill: '#737373'
  })
  text1.move( 2700,1940 ) 
  var image = mySVG.image('./styles/logo.png', 150, 125)
  image.move( 1830,1920 )
}


const drawFireplace = () => {
  frontView.model = mySVG.group()
  frontView.props = Object.assign( {}, proto_Props )  
  transformObj( frontView, 'pointScale', 'centerBottom' )
  transformObj( frontView, 'pX', axisX )
  transformObj( frontView, 'pY', floor )

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


  leftView.model = mySVG.group()
  leftView.props = Object.assign( {}, proto_Props )  
  transformObj( leftView, 'pointScale', 'centerBottom' )
  transformObj( leftView, 'pX', axisX + 1400)
  transformObj( leftView, 'pY', floor )
  
  fL.legR.model = leftView.model.use( legDef.members[ 0 ] ) 
  fL.legR.props = Object.assign( {}, proto_Props )      
  transformObj( fL.legR, 'pX', 0 )
  
  let panelDef = SVG.select( '#panel' )
  fL.panel.model = leftView.model.use( panelDef.members[ 0 ] ) 
  fL.panel.props = Object.assign( {}, proto_Props )      
  transformObj( fL.panel, 'pointScale', 'rightCenter' )
  transformObj( fL.panel, 'outlineX', -fL.panel.model.bbox().w )    
}

const drawFlame = () => {
  flame.model = mySVG.rect(700, 550)
  flame.props = Object.assign( {}, proto_Props ) 
  flame.model.attr({ 
    'stroke-width': 1,
    'vector-effect': 'non-scaling-stroke'
  })
  flame.model.addClass( 'cls-1')
  transformObj( flame, 'pointScale', 'centerBottom' )  
  transformObj( flame, 'pX', axisX - 350 )
  transformObj( flame, 'pY', 800)  
}


/*****************************************************************************/

const transformElem = ( obj, prop, val ) => {
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
    pScaleY = p.pY + m.bbox().h + p.outlineY
  }
  if ( p.pointScale == "rightCenter" ) { 

    pScaleX = 0
    pScaleY = p.pY + m.bbox().h + p.outlineY
  }   

  m.transform( { scaleY: 1, cx: pScaleX, cy: pScaleY } )
   .transform( { scaleX: 1*p.flip, cx: pScaleX, cy: pScaleY }, true )
   .rotate( 0, p.pX, p.pY + m.bbox().h )  
   .move( 0, 0 )  
  
  if ( typeof val == 'string' ) 
    eval( 'obj.props.' + prop + ' = ' + '"' + val + '"' ) 
  if ( typeof val == 'number' ) 
    eval( 'obj.props.' + prop + ' = ' + val ) 

  m.move( p.pX + p.outlineX, p.pY + p.outlineY )   
   .rotate( p.rotation, p.pX, p.pY + m.bbox().h )
   .transform( { scaleX: p.scaleX*p.flip, cx: pScaleX, cy: pScaleY } ) 
   .transform( { scaleY: p.scaleY, cx: pScaleX, cy: pScaleY }, true ) 
}


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
    pScaleX = m.bbox().cx + p.outlineX
    pScaleY = m.bbox().h
  }  
  if ( p.pointScale == "rightCenter" ) { 
    pScaleX = m.bbox().w
    pScaleY = p.pY + m.bbox().h + p.outlineY
  }     

  m.transform( { scaleY: 1, cx: pScaleX, cy: pScaleY } )
   .transform( { scaleX: 1*p.flip, cx: pScaleX, cy: pScaleY }, true )
   .rotate( 0, p.pX, p.pY + m.bbox().h )  
   .move( 0, 0 )  
  
  if ( typeof val == 'string' ) 
    eval( 'obj.props.' + prop + ' = ' + '"' + val + '"' ) 
  if ( typeof val == 'number' ) 
    eval( 'obj.props.' + prop + ' = ' + val ) 

  m.move( p.pX + p.outlineX, p.pY + p.outlineY )   
   .rotate( p.rotation, p.pX, p.pY + m.bbox().h )
   .transform( { scaleX: p.scaleX*p.flip, cx: pScaleX + p.outlineX, cy: pScaleY } ) 
   .transform( { scaleY: p.scaleY, cx: pScaleX, cy: pScaleY }, true ) 
}


/*****************************************************************************/

let d = {
  flameH: null,
  flameW: null,
  flameL: null,
  fH: null,
  fW: null,
  fD: null
}

d.flameW =  {
  drawLine: ( v ) => {
    let startX = v.model.bbox().cx - v.model.bbox().w/2*v.props.scaleX 
    let endX = v.model.bbox().cx + v.model.bbox().w/2*v.props.scaleX     
    d.flameW.mainLine = mySVG.line( startX, axisX + 350,  endX, axisX + 350).stroke({ width: 1 })
    d.flameW.mainLine.addClass( 'cls-1')
    d.flameW.mainLine.marker('start', 15, 15, function(add) {
      add.circle(15).fill('#737373')
    })
    d.flameW.mainLine.marker('end', 15, 15, function(add) {
      add.circle(15).fill('#737373')
    })
  },
  redrawLine: ( v ) => { 
    d.flameW.mainLine.remove()
    d.flameW.drawLine( v )  
  }
}


d.flameL =  {
  drawLine: ( v ) => {
    let s = floor + frontView.model.bbox().h 
    let e = v.model.bbox().y + v.model.bbox().h + v.props.scaleY 
    d.flameL.mainLine = mySVG.line( axisX,  s,  axisX, e ).stroke({ width: 1 })
    d.flameL.mainLine.addClass( 'cls-1')
    d.flameL.mainLine.marker('start', 15, 15, function(add) {
      add.circle(15).fill('#737373')
    })
    d.flameL.mainLine.marker('end', 15, 15, function(add) {
      add.circle(15).fill('#737373')
    })
  },
  redrawLine: ( v ) => { 
    d.flameL.mainLine.remove()
    d.flameL.drawLine( v )  
  }
}


d.flameH =  {
  drawLine: ( v ) => {  
     let p1 = v.model.bbox().y2 - v.model.bbox().h*v.props.scaleY
     let p2 = v.model.bbox().y2 
     d.flameH.mainLine = mySVG.line( axisX,  p1,  axisX, p2 ).stroke({ width: 1 })
     d.flameH.mainLine.addClass( 'cls-1')
     d.flameH.mainLine.marker('start', 15, 15, function(add) {
        add.circle(15).fill('#737373')
     })
     d.flameH.mainLine.marker('end', 15, 15, function(add) {
       add.circle(15).fill('#737373')
    })
  },
  redrawLine: ( v ) => { 
    d.flameH.mainLine.remove()
    d.flameH.drawLine( v )  
  }
}


d.fH =  {
  drawLine: ( v ) => {  
     let p1 = floor + v.model.bbox().h 
     let p2 = floor + v.model.bbox().h - v.model.bbox().h * v.props.scaleY 
     d.fH.mainLine = mySVG.line( axisX + 1000, p2, axisX + 1000, p1 ).stroke({ width: 1 })
     d.fH.mainLine.addClass( 'cls-1')
     d.fH.mainLine.marker('start', 15, 15, function(add) {
        add.circle(15).fill('#737373')
     })
     d.fH.mainLine.marker('end', 15, 15, function(add) {
       add.circle(15).fill('#737373')
    })
  },
  redrawLine: ( v ) => { 
    d.fH.mainLine.remove()
    d.fH.drawLine( v )  
  }
}


d.fW =  {
  drawLine: ( v ) => {  
     let p1 = axisX + v.model.bbox().x
     let p2 = axisX + v.model.bbox().x2  
     d.fW.mainLine = mySVG.line( p1, floor + 1200, p2, floor + 1200 ).stroke({ width: 1 })
     d.fW.mainLine.addClass( 'cls-1')
     d.fW.mainLine.marker('start', 15, 15, function(add) {
        add.circle(15).fill('#737373')
     })
     d.fW.mainLine.marker('end', 15, 15, function(add) {
       add.circle(15).fill('#737373')
    })
  },
  redrawLine: ( v ) => { 
    d.fW.mainLine.remove()
    d.fW.drawLine( v )  
  }
}


d.fD =  {
  drawLine: ( v ) => {  
     let p1 = axisX + v.model.bbox().x + 1400
     let p2 = axisX + v.model.bbox().x2 + 1400  
     d.fD.mainLine = mySVG.line( p1, floor + 1200, p2, floor + 1200 ).stroke({ width: 1 })
     d.fD.mainLine.addClass( 'cls-1')
     d.fD.mainLine.marker('start', 15, 15, function(add) {
        add.circle(15).fill('#737373')
     })
     d.fD.mainLine.marker('end', 15, 15, function(add) {
       add.circle(15).fill('#737373')
    })
  },
  redrawLine: ( v ) => { 
    d.fD.mainLine.remove()
    d.fD.drawLine( v )  
  }
}


const drawDimentions = () => {
  d.flameW.drawLine( flame ) 
  d.flameL.drawLine( flame )
  d.flameH.drawLine( flame )  
  d.fH.drawLine( frontView )
  d.fW.drawLine( frontView ) 
  d.fD.drawLine( leftView ) 
}


/*****************************************************************************/

const drawUiElems = () => {
  createBlock( 'Flame', ( parent ) => {
    createSelector({
        id: 'Width'
      , min: 2
      , max: 200
      , value: 100  
      , oninput: e => { 
          transformElem( flame, 'scaleX', e.target.value/100 )
          d.flameW.redrawLine( flame )
        }       
    }, parent )
    , createSelector({
        id: 'Height'
      , min: 2
      , max: 160  
      , value: 100
      , oninput: e => { 
          flame.props.scaleYsaved = e.target.value/100 
          transformElem( flame, 'scaleY', e.target.value/100 )
          d.flameH.redrawLine( flame )
        }         
    }, parent )
    , createSelector({
        id: 'Level'
      , min: -70
      , max: 100
      , value: 0
      , oninput: e => { 
          transformObj( flame, 'scaleY', 1 )
          transformObj( flame, 'pY', +e.target.value*(-1) + 900 )
          transformObj( flame, 'scaleY', flame.props.scaleYsaved )
          d.flameL.redrawLine( flame )
          d.flameH.redrawLine( flame )
        }
      }, parent )    
  })  
  createBlock( 'Fireplace', ( parent ) => { 
    createSelector({
        id: 'MainWidth'
      , min: 2
      , max: 180
      , value: 100
      , oninput: e => {
          transformObj( f.legR, 'scaleX', 1 )
          transformObj( f.frontR, 'scaleX', e.target.value/100 )
          transformObj( f.legR, 'pX', e.target.value/100*f.frontR.model.bbox().w )          
          transformObj( f.legR, 'scaleX', f.legR.props.scaleXsaved )

          transformObj( f.legL, 'scaleX', 1 )          
          transformObj( f.frontL, 'scaleX', e.target.value/100 )
          transformObj( f.legL, 'pX', e.target.value/100*f.frontL.model.bbox().w )
          transformObj( f.legL, 'scaleX', f.legR.props.scaleXsaved )  
          d.fW.redrawLine( frontView )
        }          
    }, parent )  
    createSelector({
        id: 'LegsWidth'
      , min: 50
      , max: 150
      , value: 100
      , oninput: e => {
          f.legR.props.scaleXsaved = e.target.value/100        
          transformObj( f.legR, 'scaleX', e.target.value/100 )
          transformObj( f.legL, 'scaleX', e.target.value/100 )
          transformObj( fL.legR, 'scaleX', e.target.value/100 )  
          d.fW.redrawLine( frontView )    
          d.fD.redrawLine( leftView )               
        }          
      }, parent )       
    , createSelector({
        id: 'Height'
      , min: 2
      , max: 135
      , value: 100    
      , oninput: e => { 
          transformObj( frontView, 'scaleY', e.target.value/100 )
          transformObj( leftView, 'scaleY', e.target.value/100 ) 
          d.fH.redrawLine( frontView )      
        }             
    }, parent )
    , createSelector({
        id: 'Depth'
      , min: 2
      , max: 140
      , value: 70    
      , oninput: e => { 
          transformElem( fL.panel, 'scaleX', e.target.value/100 )
          d.fD.redrawLine( leftView )
        }               
    }, parent )
  }) 
  createBlock( 'Drawing', ( parent ) => {               
    createButton({
        id: 'Download'
      , onclick: e => downloadDrawing()          
    }, parent )
  })         
}


const prepearWindow = () => {
  appWrapper = document.getElementById( 'app' )
  uiWrapper = document.createElement( 'div' )
  uiWrapper.id = 'uiWrapper'
  appWrapper.appendChild( uiWrapper )  
}


window.onresize = () => resizeWindow() 


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
    svgW = ( h - 20 )*1.415 - 3 
    svgH = h - 20 - 3 
    appWrapper.style.flexDirection = 'row'
    uiWrapper.style.height = svgH + 'px' 
    uiWrapper.style.width = w - svgW - 3 + 'px' 
    mySVG.attr({ 
        width: svgW
      , height: svgH
    })        
  }
  if ( w/h > 1.2 && w/h < 1.7 ) { 
    svgW = w-20
    svgH = (w-20)*0.7 
    appWrapper.style.flexDirection = 'row'
    uiWrapper.style.height = svgH + 'px' 
    uiWrapper.style.width = w - svgW - 3 + 'px'     
    svgW *= 0.85
    svgH *= 0.85
    mySVG.attr({ 
        width: svgW
      , height: svgH
    })       
  }      
  if ( w/h < 1 ) {  
    svgW = w - 20
    svgH = (w - 20)*0.7      
    appWrapper.style.flexDirection = 'column'
    uiWrapper.style.width = svgW - 3  + 'px'
    uiWrapper.style.height = h - svgH -3  + 'px'    
    mySVG.attr({ 
        width: svgW
      , height: svgH
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
  head.style.marginBottom = '15px'    
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
    , margin = '0px'
    , width = '70%'  
    , onkeydown = 'return false'
    , oninput = () => {}  	  
  } = props
  
  let inpName = document.createElement( 'p' )
  inpName.style.userSelect = 'none'
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
      , margin= '10px'
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

const downloadDrawing = () => {
  var svg = document.querySelector( "svg" )
  var svgData = new XMLSerializer().serializeToString( svg )        
  var can = document.createElement("canvas")
  can.width = svgW
  can.height = svgH
  var ctx = can.getContext("2d")
  ctx.fillStyle = "#0f0e11";
  ctx.fillRect( 0, 0, svgW, svgH )

  var img = document.createElement( "img" )
  img.setAttribute( "src", "data:image/svg+xml;base64," + btoa(svgData))
  img.onload = function() {
      ctx.drawImage( img, 0, 0, svgW, svgH )
      var a = document.createElement('a')
      document.body.appendChild(a)
      a.href = can.toDataURL('image/png')
      a.download = 'drawing.jpg'
      a.click();
    };
}