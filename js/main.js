
let mySVG
  , elements
  , front
  , front1 
  , windowCenterX = window.innerWidth/2


SVG.on(document, 'DOMContentLoaded', function() {
  init()
  drawFpl()
})



const init = () => {
  mySVG = SVG( 'model' )
    .attr({id:"mySVG"});
  let myCircle =  mySVG.circle(100)
    .attr({cx:200,cy:100,fill: 'green' });
}

const drawRect = () => {
  let rect = draw.rect( window.innerWidth, window.innerHeight ).attr({ fill: '#f06' })
}

const drawFpl = () => {
  let legDef = SVG.select('#leg')
  let leg = mySVG.use( legDef.members[ 0 ] ).move( 200, 0 ) 
  //leg.transform( { scaleX: 15, scaleY: 0.8 } )
  leg.size( 800, 800)
  leg.attr( { stroke: '#00f' } )
  leg.x( 500 )

  /*let elemsLeg = leg.select( 'fil0' )
  elemsLeg.attr({
    fill: 'none'
  , stroke: '#000'
  , 'stroke-width': 15
  })*/

  

  //instFront.width(800 )
  //instFront.width( 200 )
  //front.x( 200 )
  //front.y( 200 )

  //front.y( 200 )

  //frontR = front.clone()        
  //frontR.flip('x')

  // front.move( 400 )
  //front.x( windowCenterX )    
  // frontR.move( -400 )

  // front.y( 200 )
  // frontR.y( 200 )        
  // front.transform( { scaleX: 1.2 } )
} 
