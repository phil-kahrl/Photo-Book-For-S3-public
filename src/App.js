import React, { Component } from 'react';
import './App.css';
import Banner from './components/Banner';
import LoadingIndicator from './components/LoadingIndicator';
import DesktopContent from './components/DesktopContent';
import MobileContent from './components/MobileContent';
import EmptyContent from './components/EmptyContent';
import LoadingError from './components/LoadingError';
import About from './components/About';
import { MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Philosopher',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

class App extends Component {
  render() {
    let content = this.props.appData.isSmartPhone ? (
      <MobileContent {...this.props} />
    ) : (
      <DesktopContent {...this.props} />
    );

    if(window.location.hash === '#about') {
      return (
        <div>
          <Banner {...this.props} />
          <About {...this.props} />
        </div>
        )
      } else {
        return (
          <MuiThemeProvider theme={theme}>
            <div>
              <Banner {...this.props} />
              {this.props.appData.state === 'EMPTY' && (
                <EmptyContent {...this.props} />
              )}
              {this.props.appData.state === 'INITIALIZED' && <div>{content}</div>}
              {this.props.appData.state === 'UNINITIALIZED' && <LoadingIndicator />}
              {this.props.appData.state === 'ERROR' && <LoadingError />}
            </div>
          </MuiThemeProvider>

        );
      }
  }
}

export default App;
