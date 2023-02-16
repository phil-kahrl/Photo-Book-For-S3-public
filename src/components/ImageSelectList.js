import React, { Component } from 'react';

class ImageSelectList extends Component {
  constructor(props) {
    super(props);
    this.state = { currentImage: props.appData.currentImage };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { currentImage: nextProps.appData.currentImage };
  }

  render() {
    const changeHandler = event => {
      this.setState({ currentImage: event.target.value });
      const selectedImage = this.props.appData.imageList[event.target.value]
      this.props.appData.clickHandler(selectedImage);
    };

    const options = this.props.appData.imageList.map(image => {
      const lastUpdated = new Date(image.lastModified).toLocaleDateString()
      return (
        <option value={image.index} key={image.url}>
          {image.name} ({lastUpdated})
        </option>
      );
    });

    return (
      <select
        value={this.state.currentImage.index}
        onChange={changeHandler}
        style={{ width: '300px' }}
      >
        {options}
      </select>
    );
  }
}

export default ImageSelectList;
