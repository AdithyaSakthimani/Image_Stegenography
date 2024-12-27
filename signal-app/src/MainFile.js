import React from 'react'

function MainFile() {
  return (
    <div className="page">
    <div className="content">
      <h1 className="home-title">Image Steganography</h1>
      <p className="home-subtitle">
        Hide and extract text messages within images using Huffman coding
      </p>

      <div className="grid">
        <Link to="/encode" className="nav-card">
          <ImageUp className="nav-icon" />
          <h2 className="nav-title">Encode Message</h2>
          <p className="nav-description">Hide text within an image</p>
        </Link>

        <Link to="/decode" className="nav-card">
          <ImageDown className="nav-icon" />
          <h2 className="nav-title">Decode Message</h2>
          <p className="nav-description">Extract hidden text from images</p>
        </Link>
      </div>
    </div>
  </div>
  )
}

export default MainFile
