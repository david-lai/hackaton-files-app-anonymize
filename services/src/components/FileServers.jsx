//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EntityBrowser } from 'ebr-ui';
import { LeftNavLayout, Loader, Menu, MenuGroup, MenuItem, StackingLayout, TextLabel, Title,
  Divider, FlexLayout, FlexItem } from 'prism-reactjs';
import EntityConfigs from '../config/entity_configs.js';
import AppConstants from '../utils/AppConstants';
import AppUtil from '../utils/AppUtil';
import EBComponentFactory from '../utils/EBComponentFactory';
import FilesQuery from '../utils/FilesQuery';
import i18n from '../utils/i18n';

import FileServerSummary from './FileServerSummary.jsx';
import AlertSummary from './AlertSummary.jsx';

// Actions
import {
  openModal
} from '../actions';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServers', key, defaultValue, replacedValue);

class FileServers extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      fileServersNum: '',
      showSummary: true,
      ebConfiguration: this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER)
    };
  }

  getEbConfiguration= (entityType) => {
    // EB Configurations
    this.entityTypes = [
      entityType
    ];
    this.entityTypeDisplayNames = {
      [AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER]: {
        singular: AppConstants.ENTITY_TYPE_NAME.ENTITY_FILE_SERVER,
        plural: AppConstants.ENTITY_TYPE_NAME_PLURAL.ENTITY_FILE_SERVER
      },
      [AppConstants.ENTITY_TYPES.ENTITY_ALERT]: {
        singular: AppConstants.ENTITY_TYPE_NAME.ENTITY_ALERT,
        plural: AppConstants.ENTITY_TYPE_NAME_PLURAL.ENTITY_ALERT
      },
      [AppConstants.ENTITY_TYPES.ENTITY_EVENT]: {
        singular: AppConstants.ENTITY_TYPE_NAME.ENTITY_EVENT,
        plural: AppConstants.ENTITY_TYPE_NAME_PLURAL.ENTITY_EVENT
      }
    };
    this.entityGroupings = [
      {
        sectionName: '',
        entities: [
          {
            entity: entityType
          }
        ]
      }
    ];

    // Create the EB configuration we will be using
    const queryConfig = {
      pollingSec: AppConstants.POLLING_FREQ_SECS,
      queryProcessorName: 'GroupsV3UQDC'
    };

    return {
      ebId: entityType,
      entityTypes: this.entityTypes,
      entityTypeDisplayNames: this.entityTypeDisplayNames,
      selectedEntityType: this.entityTypes[0],
      entityConfigs: EntityConfigs,
      entityGroupings: this.entityGroupings,
      showEntityTypeSelector: false,
      showFiltersBar: false,
      showFiltersPanel: true,
      filterBarPlaceholder: i18nT('typeName', 'Type name to filter'),
      filtersPanelCollapsed: true,
      queryConfig,
      ebComponentFactory: EBComponentFactory.getInstance({ openModal: this.props.openModal })
    };
  }

  onMenuChange = (e) => {
    if (e.key !== AppConstants.SUMMARY_TAB_KEY) {
      this.setState({
        showSummary: false,
        ebConfiguration: this.getEbConfiguration(e.key)
      });
    } else {
      this.setState({
        showSummary: true
      });
    }
  }

  getLeftPanel() {
    const fileServers_num = Number(this.state.fileServersNum);
    const numFileServers = this.renderFileServersCount(fileServers_num);

    return (
      <Menu oldMenu={ false }
        itemSpacing="10px"
        padding="20px-0px"
        activeKeyPath={ [this.state.currentPanelKey, '1'] }
        onClick={ this.onMenuChange } style={ { width: '240px' } } >

        <StackingLayout padding="0px-20px" itemSpacing="10px">
          <Title>{ i18nT('files', 'Files') }</Title>
          <div><TextLabel>{ numFileServers }</TextLabel></div>
          <Divider type="short" />
        </StackingLayout>

        <MenuGroup key="1">
          <MenuItem key={ AppConstants.SUMMARY_TAB_KEY }>
            { i18nT('summary', 'Summary') }
          </MenuItem>
          <MenuItem key={ AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER }>
            { i18nT('files', 'Files') }
          </MenuItem>
          <MenuItem key={ AppConstants.ENTITY_TYPES.ENTITY_ALERT }>
            { i18nT('alerts', 'Alerts') }
          </MenuItem>
          <MenuItem key={ AppConstants.ENTITY_TYPES.ENTITY_EVENT }>
            { i18nT('events', 'Events') }
          </MenuItem>
        </MenuGroup>
      </Menu>
    );
  }

  // Render buckets counts accounting for unavailability
  renderFileServersCount(count) {
    if (isNaN(count)) {
      return <Loader tip={ i18nT('files', 'Files') } />;
    }
    switch (count) {
      case -1:
        return <Loader tip={ i18nT('files', 'Files') } />;
      case 0:
        return i18nT('noFile', 'No File');
      case 1:
        return i18nT('oneFile', 'One File');
      default:
        return i18nT('numOfFiles', '{num} Files',
          { num: AppUtil.rawNumericFormat(count) });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <LeftNavLayout leftPanel={ this.getLeftPanel() } itemSpacing="0"
        rightBodyContent={ !this.state.showSummary ? (
          <EntityBrowser { ...this.state.ebConfiguration } />
        ) : (
          <FlexLayout className="entity-browser" itemSpacing="0px" flexGrow="1">
            <FlexItem className="main-content" flexGrow="1">
              <FlexLayout itemSpacing="10px" flexGrow="1" itemFlexBasis="100pc">
                <FlexItem>
                  <FileServerSummary />
                </FlexItem>
                <FlexItem>
                  <AlertSummary />
                </FlexItem>
              </FlexLayout>
            </FlexItem>
          </FlexLayout>
        )
        } />
    );
  }

  componentWillMount() {
    // Fetch the policies for all NetworkServiceProvider cats
    FilesQuery.fetchFsData(AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER)
      .then(
        (files) => {
          // Register the map with the component factory
          this.setState({
            loading: false,
            fileServersNum: files.length
          });
        })
      .catch(() => {
        this.setState({
          loading: false,
          errorMessage: i18nT('errorFetchingPolicies', 'Error fetching File Servers') });
      });
  }

}

const mapDispatchToProps = dispatch => {
  return {
    openModal: (type, options) => dispatch(openModal(type, options))
  };
};

FileServers.propTypes = {
  openModal: PropTypes.func
};

export default connect(
  null,
  mapDispatchToProps
)(FileServers);
