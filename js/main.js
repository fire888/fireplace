

'use strict' 

const checkDate = () => {
  let d = new Date()
  let t = 'date: ' + d.getDay() + '.' + d.getMonth() + '.' + d.getFullYear()  
  return t
} 

/*****************************************************************************/

let mySVG, svgW, svgH,
text = {
  org: 'ArtMarbleStudio.ru',
  modelBefore: 'MODEL: ',
  model: 'Batichinelly',
  modelId: '#004032',
  marbleBefore: 'marble: ',
  marble: '"White-Antic"',
  date: checkDate(),
  clientId: 'cl: ' + Math.floor( Math.random()*100000 ),
  priceBefore: 'Price: ',
  price: null,
  priceAfter: ' *'
},
textSVG = {},
fontStyleShtamp = {
  family: 'roboto',
  size: 30,
  anchor: 'left',
  leading: '1.5em',
  fill: '#737373'
},
styleShtamp = {      
  fill: 'none',
  'stroke-width': 1,
  'vector-effect': 'non-scaling-stroke'
},
frontView = {
  model: null, props: null
},
leftView = {
  model: null, props: null
}, 
f = {  
  frontR: {
    model: null, props: null 
  },
  frontL: {
    model: null, props: null 
  },       
  legR: { 
    model: null, props: null 
  },
  legL: { 
    model: null, props: null, 
  }      
},
fL = {
  legR: {
    model: null, props: null 
  },    
  panel: { 
    model: null, props: null, 
  }    
},
flame = {
  model: null, props: null
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
axisX = 1200, axisX2 = 2600, floor = 450,
appWrapper, uiWrapper   


/*****************************************************************************/

SVG.on( document, 'DOMContentLoaded', () => {
  prepearWindow() 
  initSvg() 
  drawShtamp()
  drawShtampText()        
  drawFireplace()
  drawFlame()   
  drawDimentions()
  drawUiElems()
  resizeWindow()
  calckPrice()
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
  let polylineShtamp = mySVG.polygon( '200,50    2920,50   2920,2050   200,2050')
    .attr( styleShtamp ).addClass( 'cls-1')
  let polylineframe = mySVG.polygon( '2,2    2968,2   2968,2098   2,2098')
    .attr( styleShtamp ).addClass( 'cls-1')
  polylineframe.addClass( 'cls-1')
  let r = mySVG.polygon( '2920,1900  1800,1900  1800,2050  2000,2050 2000,1900  ' ) 
    .attr( styleShtamp ).addClass( 'cls-1')
  r.addClass( 'cls-1')
}


const drawShtampText = () => {
  textSVG.org = mySVG.text( ( add ) => { add.tspan( text.org ) } )
    .font( fontStyleShtamp ).move( 2010, 1905 ) 
  textSVG.model = mySVG.text( ( add ) => { add.tspan( text.modelBefore + text.model + text.modelId ) } )
    .font( fontStyleShtamp ).move( 2010, 1955 )
  textSVG.date = mySVG.text( ( add ) => { add.tspan( text.date ) } )
    .font( fontStyleShtamp ).move( 2600, 1955 )  
  textSVG.client = mySVG.text( ( add ) => { add.tspan( text.clientId ) } )
    .font( fontStyleShtamp ).move( 2600, 1905 )
  textSVG.marble = mySVG.text( ( add ) => { add.tspan( text.marbleBefore + text.marble ) } )
    .font( fontStyleShtamp ).move( 2010, 2000 )   
  textSVG.price = mySVG.text( ( add ) => { add.tspan( text.priceBefore + text.price + text.priceAfter ) } )
    .font( fontStyleShtamp ).move( 250, 1950 )     
  var image = mySVG.image( './styles/logo.png', 150, 125 )
  image.move( 1830, 1920 )
}


/*****************************************************************************/

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
  flame.model.attr( styleShtamp )
  flame.model.addClass( 'cls-1')
  transformElem( flame, 'pointScale', 'centerBottom' )  
  transformElem( flame, 'pX', axisX - 350 )
  transformElem( flame, 'pY', frontView.model.bbox().y + frontView.model.bbox().h  )  
  transformElem( flame, 'pY', frontView.model.bbox().y2 - 240 )  
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

  m.move( p.pX + p.outlineX, p.pY  )   
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

  m.move( p.pX + p.outlineX, p.pY )   
   .rotate( p.rotation, p.pX, p.pY + m.bbox().h )
   .transform( { scaleX: p.scaleX*p.flip, cx: pScaleX + p.outlineX, cy: pScaleY } ) 
   .transform( { scaleY: p.scaleY, cx: pScaleX, cy: pScaleY }, true ) 
}


/*****************************************************************************/

const drawDimentions = () => {
  d.flameW = new Dimention( propsDimflameW, flame ) 
  d.flameL = new Dimention( propsDimflameL, flame ) 
  d.flameH = new Dimention( propsDimflameH, flame )  
  d.fH = new Dimention( propsDimFireplaceH, frontView )  
  d.fW = new Dimention( propsDimFireplaceW, frontView ) 
  d.fD = new Dimention( propsDimFireplaceD, leftView )    
}


class Dimention{
  constructor( props, ob ) {

    this.realValue = null

    let { sX = null, sY = null, eX = null, eY = null } = props
    let orient
    sY == null ? orient = 'vert' : orient = 'gor'
    if ( orient == 'gor' ) {
      this.textOffsetX = -30      
      this.textOffsetY = -50
    } 
    if ( orient == 'vert' ) {
      this.textOffsetX = 15     
      this.textOffsetY = -10
    }       
    this.sX = sX
    this.sY = sY
    this.eX = eX
    this.eY = eY    
    this.line = null
    this.text = null
    this.textVal = null
    this.changeMainPoints = props.changePoints
    this.draw( ob ) 
  }
  reDraw( ob ) {
    this.line.remove()
    this.text.remove()    
    this.draw( ob )
  }  
  draw( ob ) {
    this.changeMainPoints( ob, this )
    this.drawMainLine()
    this.drawText()
  } 
  drawMainLine() {
    this.line = mySVG.line( this.sX, this.sY, this.eX, this.eY )
      .stroke( { width: 1 } ).addClass( 'cls-1' )
      .marker( 'start', 15, 15, ( add ) => {
           add.circle( 15 ).fill( '#737373' )
        } )
      .marker( 'end', 15, 15, ( add ) => {
          add.circle( 15 ).fill( '#737373' )
        } )    
  } 
  drawText() {
    this.line.bbox().w == 0 ? this.textVal = this.line.bbox().h : this.textVal = this.line.bbox().w 
    this.realValue = Math.floor( this.textVal * 1.1/10 ) + '0'
    this.text = mySVG.text( (add) => {
      add.tspan( this.realValue ).newLine() 
    })
    this.text.font( fontStyleShtamp )
    this.text.move( this.line.bbox().cx + this.textOffsetX, this.line.bbox().cy + this.textOffsetY )
    calckPrice()
  }
} 

let d = { flameH: null, flameW: null, flameL: null, fH: null, fW: null, fD: null }

let propsDimflameW = {
  sY: floor + 1100, 
  eY: floor + 1100,  
  changePoints: ( v, obToChange ) => {
    obToChange.sX = v.model.bbox().cx - v.model.bbox().w/2*v.props.scaleX 
    obToChange.eX = v.model.bbox().cx + v.model.bbox().w/2*v.props.scaleX     
  }
},
propsDimflameL = {
  sX: axisX, 
  eX: axisX, 
  changePoints: ( v, obToChange ) => {
    obToChange.sY = floor + frontView.model.bbox().h 
    obToChange.eY = v.model.bbox().y + v.model.bbox().h + v.props.scaleY     
  }
},
propsDimflameH = {
  sX: axisX, 
  eX: axisX, 
  changePoints: ( v, obToChange ) => {
    obToChange.sY = v.model.bbox().y2 - v.model.bbox().h*v.props.scaleY
    obToChange.eY = v.model.bbox().y2     
  }
},
propsDimFireplaceH = {
  sX: axisX + 1000, 
  eX: axisX + 1000, 
  changePoints: ( v, obToChange ) => {
    obToChange.sY = floor + v.model.bbox().h 
    obToChange.eY = floor + v.model.bbox().h - v.model.bbox().h * v.props.scaleY     
  }
},
propsDimFireplaceW = {
  sY: floor + 1200,  
  eY: floor + 1200,  
  changePoints: ( v, obToChange ) => {
    obToChange.sX = axisX + v.model.bbox().x
    obToChange.eX = axisX + v.model.bbox().x2      
  }
},
propsDimFireplaceD = {
  sY: floor + 1200,  
  eY: floor + 1200,  
  changePoints: ( v, obToChange ) => {
    obToChange.sX = axisX + v.model.bbox().x + 1400
    obToChange.eX = axisX + v.model.bbox().x2 + 1400       
  }
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
          d.flameW.reDraw( flame )
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
          d.flameH.reDraw( flame )
        }         
    }, parent )
    , createSelector({
        id: 'Level'
      , min: -100
      , max: 200
      , value: 50
      , oninput: e => { 
          transformElem( flame, 'scaleY', 1 )
          transformElem( flame, 'pY', e.target.value*(-1) + frontView.model.bbox().y2 - 240 )
          transformElem( flame, 'scaleY', flame.props.scaleYsaved )
          d.flameL.reDraw( flame )
          d.flameH.reDraw( flame )
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
          d.fW.reDraw( frontView )
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
          d.fW.reDraw( frontView )    
          d.fD.reDraw( leftView )               
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
          d.fH.reDraw( frontView )      
        }             
    }, parent )
    , createSelector({
        id: 'Depth'
      , min: 2
      , max: 140
      , value: 70    
      , oninput: e => { 
          transformElem( fL.panel, 'scaleX', e.target.value/100 )
          d.fD.reDraw( leftView )
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

const calckPrice = () => {
  if ( ! d.fW  ) return 
  if ( ! d.fH  ) return 
  if ( ! d.fD  ) return
  
  let w =  Math.floor( (+d.fW.realValue) * 45 * (+d.fH.realValue)/270 * ((+d.fD.realValue) * 0.0018 + 1.2) )
  
  let t = w
  t = formatNumber( t )

  textSVG.price.remove()
  textSVG.price = mySVG.text( ( add ) => { add.tspan('Price: ' + t + ' *' ) } )
  textSVG.price.font( fontStyleShtamp )
  textSVG.price.move( 300, 1905 )
}

const formatNumber = ( v ) => {
  let n = v + ''
  let s = ''
  for( let i = n.length - 1; i > -1; i -- ) {  
    ( i + 1 )%3 == 0 ? s = s + ' ' : s
    i < 4 ? s += '0' : s = s + n[ n.length - i - 1 ]  
  }
  return s 
}

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
  img.onload = () => {
      ctx.drawImage( img, 0, 0, svgW, svgH )
      var a = document.createElement('a')
      document.body.appendChild(a)
      a.href = can.toDataURL('image/png')
      a.download = 'drawing.jpg'
      a.click();
    };
}

