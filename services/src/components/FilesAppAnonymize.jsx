//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The Files App Anonymize view
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StackingLayout, ElementPlusLabel, Checkbox, FlexLayout,
  InputPlusLabel, FormLayout, Select, Button
} from 'prism-reactjs';
// Actions
import {
  fetchFsData,
  postAnonymize
} from '../actions';

const DURATION = 30000;

class FilesAppAnonymize extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      file_server_name_list: [],
      path: '',
      out_path: '',
      is_ip: false,
      is_ssn: false,
      src_pattren: '',
      dst_pattern: ''
    };

    this.extractFsData = this.extractFsData.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFsInputChange = this.handleFsInputChange.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
  }

  extractFsData() {
    const dataArray = [];
    if (this.props.fsData) {
      let fsName = [];
      for (var i = 0; i < Number(this.props.fsData.total_entity_count); i++) {
        fsName.push(this.props.fsData.group_results[0].entity_results[i].data[0].values[0].values);
      }
      for (var j = 0; j < fsName.length; j++) {
        var data = {
          value: fsName[j][0],
          title: fsName[j][0],
          key: j
        };
        dataArray.push(data);
      }
    }
    return dataArray;
  }

  onClickCheckbox(id, e) {
    this.setState({ [id]: e.target.checked });
  }

  handleInputChange(id, e) {
    this.setState({ [id]: e.currentTarget.value });
  }

  handleFsInputChange(value) {
    this.setState({
      file_server_name_list: value
    });
  }

  handleClickSubmit() {
    this.props.postAnonymize(this.state);
  }

  showAnonymizeResult() {
    return (
      <div>
        {this.props.anonymizeData}
      </div>
    );
  }

  render() {
    var dataArray = this.extractFsData();

    const header = (
      <StackingLayout>
        <FlexLayout alignItems="center" itemSpacing="10px" padding="20px"
          style={ { backgroundColor: '#22272E' } }>
          <span style={ { color: '#9AA5B5' } }>Files App Anonymize</span>
        </FlexLayout>
      </StackingLayout>
    );

    const body = (
      <StackingLayout>
        <ElementPlusLabel
          label="File Server"
          element={
            <Select label="Select Option" placeholder="Select File Server"
              selectOptions={ dataArray }
              onChange={ this.handleFsInputChange }
              multiple={ true }
            />
          }
        />

        <InputPlusLabel label="Directory Path/File Path" id="path"
          placeholder="e.g. /dir1/" onChange={ e => this.handleInputChange('path', e) } />
        <InputPlusLabel label="Out Directory/File Path" id="out_path" placeholder="e.g. /dir1/"
          onChange={ e => this.handleInputChange('out_path', e) } />
        <FlexLayout itemFlexBasis="100pc">
          <Checkbox id="is_ip" label="IP Anonymization" checked={ this.state.is_ip }
            onChange={ e => this.onClickCheckbox('is_ip', e) } />
          <Checkbox id="is_ssn" label="SSN" checked={ this.state.is_ssn }
            onChange={ e => this.onClickCheckbox('is_ssn', e) } />
        </FlexLayout>
        <FlexLayout itemFlexBasis="100pc">
          <InputPlusLabel label="Pattern Reg Expression" id="src_pattren"
            onChange={ e => this.handleInputChange('src_pattren', e) } />
          <InputPlusLabel label="Replace" id="dst_pattern"
            onChange={ e => this.handleInputChange('dst_pattern', e) } />
        </FlexLayout>
        {this.showAnonymizeResult()}
      </StackingLayout>
    );
    const footer = (
      <FlexLayout itemSpacing="10px" justifyContent="center">
        <Button onClick={ this.handleClickSubmit }>Apply</Button>
      </FlexLayout>
    );
    if (this.props.fsData) {
      return (<div>
        <FormLayout
          contentWidth="600px"
          header={ header }
          body={ body }
          footer={ footer } />
      </div>);
    }
    return (<div>No data</div>);
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
    fsData: state.groupsapi.fsData,
    anonymizeData: state.groupsapi.anonymizeData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFsData: () => dispatch(fetchFsData()),
    postAnonymize: () => dispatch(postAnonymize())
  };
};

FilesAppAnonymize.propTypes = {
  fsData: PropTypes.object,
  anonymizeData: PropTypes.object,
  fetchFsData: PropTypes.func,
  postAnonymize: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesAppAnonymize);

