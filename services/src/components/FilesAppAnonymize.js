//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The Files App Anonymize view
//
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    StackingLayout, ElementPlusLabel, Menu, MenuItem, MenuController, Checkbox,
    Divider, FlexLayout, InputSearch, Alert, InputPlusLabel, FormLayout, Select, Button, RadioGroup, Radio
} from 'prism-reactjs';
import AppUtil from '../utils/AppUtil';
import i18n from '../utils/i18n';
// Actions
import {
  openModal,
  fetchFsData
} from '../actions';

const DURATION = 30000;

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FilesAppAnonymize', key, defaultValue, replacedValue);

class FilesAppAnonymize extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
        visible: false,
        open: false,
        fsNames: props.fsNames || [],
        searchKeyword: props.searchKeyword || '',
        fileSource: props.fileSource || '',
        anonymizeIp: props.anonymizeIp || false
    };

    this.extractFsData = this.extractFsData.bind(this);
    // this.renderDashboard = this.renderDashboard.bind(this);
    // this.openApp = this.openApp.bind(this);
  }

  extractFsData() {
    const dataArray = [];
    if (this.props.fsData) {
      let fsName = [];
      for (var i = 0; i < Number(this.props.fsData.total_entity_count); i++) {
          fsName.push(this.props.fsData.group_results[0].entity_results[i].data[0].values[0].values);
      }
      for (var i = 0; i < fsName.length; i++) {
        var data = {
            value: fsName[i][0],
            title: fsName[i][0],
            key: i
        };
        dataArray.push(data);
      }
    }
    return dataArray;
  }

  onClickAnonymizeIp(e) {
    this.setState({anonymizeIp: e.target.checked})
  }

  handleInputChange(id, e) {
    this.setState({[id]: event.target.value})
  }

  render() {
    var dataArray = this.extractFsData();
    const {
        anonymizeIp, filePath
    } = this.state;

    const menu = (
      <Menu theme="dark" oldMenu={false} activeKeyPath={['1']} >
        <MenuItem key="1">Summary</MenuItem>
        <MenuItem key="2">Alerts</MenuItem>
        <MenuItem key="3">Metrics</MenuItem>
        <MenuItem key="4">Network</MenuItem>
        <MenuItem key="5">Health</MenuItem>
      </Menu>
    );
    const header = (
        <StackingLayout>
            <FlexLayout alignItems="center" itemSpacing="10px" padding="20px" style={{ backgroundColor: '#22272E' }}>          
                <span style={{ color: '#9AA5B5' }}>Files App Anonymize</span>
            </FlexLayout>
        </StackingLayout>
    );

        const body = (
            <StackingLayout>
                <InputPlusLabel label="File Source" id="fileSource" placeholder="e.g. /dir1/" onChange={e => this.handleInputChange('fileSource', e)} />
                <Checkbox id="anonymize_ip" label="Anonymize IP" checked={this.state.anonymizeIp} onChange={ this.onClickAnonymizeIp } />
            </StackingLayout>
        );
        const footer = (
            <FlexLayout itemSpacing="10px" justifyContent="flex-end">
                <Button onClick={this.handleClickSubmit}>Submit</Button>
            </FlexLayout>
        );
        if (this.props.fsData) {
            return (<div>
                <FormLayout
                    contentWidth="600px"
                    header={header}
                    body={body}
                    footer={footer} />
            </div>);
        } else {
            return (<div></div>);
        }
  }

  // Fetch Apps
  componentWillMount() {
    this.props.fetchFsData();
    this.dataPolling = setInterval(
      () => {
        this.props.fetchFsData();
      }, DURATION);
  }
}

const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openModal: (type, options) => dispatch(openModal(type, options)),
    fetchFsData: () => dispatch(fetchFsData())
  };
};

FilesAppAnonymize.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesAppAnonymize);

// export default FilesAppAnonymize;
// export default connect(
//   null,
// )(FilesApps);
