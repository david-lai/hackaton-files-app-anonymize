//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The Files Apps view
//
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Dashboard,
  DashboardWidgetLayout,
  DashboardWidgetHeader,
  FlexLayout,
  FlexItem,
  Link,
  Title,
  TextLabel,
  Button
} from 'prism-reactjs';
import AppUtil from '../utils/AppUtil';
import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'Summary', key, defaultValue, replacedValue);

class FilesApps extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {

    };

    this.renderDashboard = this.renderDashboard.bind(this);
    this.openApp = this.openApp.bind(this);
  }

  // Event handler to open App
  openApp(e) {
    const appUrl = e.currentTarget.getAttribute('data-url');
	window.open(appUrl, "_blank");
  }

  // Returns App dashboard
  renderDashboard(data) {
  	return (
      <div key={data.title}>
        <DashboardWidgetLayout
          header={
            <div
              style={
                {
                  margin: '0 auto',
                  padding: '50px 0'
                }
              }
            >
              <DashboardWidgetHeader
                showCloseIcon={ false }
                title={
            	  <Title size="h1">
            		{data.title}
            	  </Title>
                }
              />
            </div>
          }
          footer={
            <div
              style={
                {
                  margin: '0 auto',
                  padding: '30px 0'
                }
              }
            >
              <Button data-url={ data.url } onClick={ this.openApp } >
                Open App
              </Button>
            </div>
          }
          bodyContent={ data.desc }
          bodyContentProps={
            {
              flexDirection: 'column',
              alignItems: 'stretch'
            }
          }
        />
      </div>
	)
  }


  render() {
  	const data = [{
  	  title: 'app1',
  	  desc: '1st App',
  	  url: 'https://www.google.com/flights#flt=/m/0f04v..2020-02-27*./m/0f04v.2020-03-02;c:USD;e:1;ls:1w;sd:0;t:h'
  	},{
  	  title: 'app2',
  	  desc: '2nd App',
  	  url: 'https://www.evaair.com/en-us/index.html'
  	},{
  	  title: 'app3',
  	  desc: '3rd App',
  	  url: 'https://www.dealnews.com/?group=category'
  	},{
  	  title: 'app4',
  	  desc: '4th App',
  	  url: 'https://my.yahoo.com/'
  	},{
  	  title: 'app5',
  	  desc: '5th App',
  	  url: 'https://www.youtube.com/watch?v=T06yJR-Xzd4'
  	},{
  	  title: 'app6',
  	  desc: '6th App',
  	  url: 'https://www.youtube.com/watch?v=m6taYpBBQAA'
  	},{
  	  title: 'app7',
  	  desc: '7th App',
  	  url: 'https://www.youtube.com/watch?v=o9NILK4OXpo'
  	},{
  	  title: 'app8',
  	  desc: '8th App',
  	  url: 'https://www.youtube.com/watch?v=npZYUkXFqd4'
  	}];

  	const pros = {
  	  layouts: {
        sm: _.map(data, app => {
  	      return {i: app.title}
  	    })
      }
    }

  	return (
  	  <Dashboard {...pros}>
       { _.map(data, app => {
         return this.renderDashboard(app)
        }) }
      </Dashboard>
  	)
  }

  // Fetch Apps
  componentWillMount() {
    // Fetch aggregated summary data
    // AppUtil.fetchSummaryAlertData()
    //   .then(
    //     (summaryData) => {
    //       this.setState({
    //         loading: false,
    //         summaryData
    //       });
    //     })
    //   .catch(() => {
    //     this.setState({
    //       loading: false,
    //       errorMessage: i18nT('errorFetchingAlerts', 'Error fetching Alerts') });
    //   });
  }
}


FilesApps.propTypes = {};

export default FilesApps;
// export default connect(
//   null,
// )(FilesApps);
