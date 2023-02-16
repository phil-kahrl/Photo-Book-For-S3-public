import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Footer from '../components/Footer';
import './ImageList.css';
import StarIcon from '@material-ui/icons/Star';

export default class ImageList extends Component {
  render() {
    const content = [];

    this.props.appData.imageList.forEach(image => {
      const handler = this.props.appData.clickHandler.bind(null, image);
      const icon =
        this.props.appData.currentImage.url === image.url ? (
          <StarIcon />
        ) : (
          <span />
        );

      const visited = this.props.appData.visited.indexOf(image.url) >= 0;

      let style  = visited ? {fontSize: '16px', color: 'black'} : 
                             {fontSize: '16px', color: 'blue'};

      const lastModified = new Date(image.lastModified).toLocaleDateString()
      let primary = (<div style={style}>{image.name}</div>)
      let secondary = (<span style={{fontSize: '0.75rem'}}>{lastModified}</span>)
      content.push(
        <ListItem
          button
          value={image.url}
          key={image.url}
          onClick={handler}
          style={{height: '3.7em'}}
        >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
      );
    });

    return (
      <div>
        <List
            style={{
              height: '700px',
              maxHeight: '700px',
              overflow: 'scroll',
              flexGrow: 1,
              flexBasis: '30%',
              minWidth: '300px',
              fontFamily: 'inherit'
        }}>
          {content}
        </List>
          <Footer {...this.props} />
      </div>
    );
  }
}
