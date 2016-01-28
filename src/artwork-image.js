var React = require('react')
let LazyLoad = require('react-lazy-load')

var Markdown = require('./markdown')
var Image = require('./image')

var ArtworkImage = React.createClass({
  render() {
    let {art, id} = this.props
    let aspectRatio = art.image_width/art.image_height
    let maxWidth = window.innerWidth ? Math.min(window.innerWidth, 400) : 400
    let width = aspectRatio >= 1 ? maxWidth : maxWidth/aspectRatio
    let height = aspectRatio >= 1 ? maxWidth/aspectRatio : maxWidth
    let padding = width >= maxWidth ? -8 : -8+(maxWidth-width)/2

    var image = <Image art={art}
      style={{width: width, height: height}}
      ignoreStyle={true}
      itemProp="image"
      alt={art.description}
      lazyLoad={this.props.lazyLoad} />

    var showImage = art.image == 'valid' && art.image_width > 0 && art.rights !== 'Permission Denied'

    return showImage && (
      <div className='artwork-image' style={{minHeight: '173px'}}>
        {image}
        <Markdown>{art.image_copyright}</Markdown>
      </div>
    )
  },

  getDefaultProps() {
    return {lazyLoad: true}
  },
})

module.exports = ArtworkImage
